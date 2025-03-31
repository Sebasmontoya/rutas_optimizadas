import 'reflect-metadata'
import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer'
import PostgresException from '@common/http/exceptions/PostgresException'
import { logger } from '@common/logger'
import TYPESDEPENDENCIES from '@modules/RutasOptimizadas/dependencies/TypesDependencies'
import { RutasOptimizadasRepository } from '@modules/RutasOptimizadas/domain/repositories/RutasOptimizadasRepository'
import { injectable } from 'inversify'
import { IDatabase, IMain } from 'pg-promise'
import {
    IEnvioOut,
    IEquipoRepartoOut,
    IEventoInesperadoOut,
    IOptimizacionRutaOut,
    ITraficoClimaOut,
    IVehiculoOut,
} from '@modules/RutasOptimizadas/usecase/dto/out'
import { UpdateParams } from '@modules/RutasOptimizadas/domain/types/UpdateParams'

@injectable()
export default class PostgresRutasOptimizadasRepository implements RutasOptimizadasRepository {
    db = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(TYPESDEPENDENCIES.dbCm)

    async obtenerRutaOptimaExistente(idEquipo: string): Promise<IOptimizacionRutaOut | null> {
        try {
            const sqlQuery = `
                                SELECT id, id_equipo, fecha, ruta_optima, id_evento, created_at
                                FROM logistica.optimizacion_rutas 
                                WHERE id_equipo = $/idEquipo/
                                AND fecha::DATE = CURRENT_DATE -2
                                AND ruta_optima IS NOT NULL
                                ORDER BY created_at DESC
                                LIMIT 1
                             `

            return await this.db.oneOrNone<IOptimizacionRutaOut>(sqlQuery, { idEquipo })
        } catch (error) {
            logger.error('RUTAS_OPTIMIZADAS', 'obtenerRutaOptimaExistente', [
                `Error consultando ruta óptima: ${error.message}`,
            ])
            throw new PostgresException(500, `Error al consultar ruta óptima en postgres: ${error.message}`)
        }
    }

    async obtenerEnvios(): Promise<IEnvioOut[]> {
        try {
            const sqlQuery = `
                                SELECT id,
                                    ST_AsGeoJSON(destino)::json AS destino,
                                    direccion_destino,
                                    ciudad_destino,
                                    departamento_destino,
                                    peso_carga,
                                    sla_entrega,
                                    estado,
                                    prioridad,
                                    created_at,
                                    updated_at
                                FROM logistica.envios 
                                WHERE estado NOT IN ('entregado', 'cancelado')
                            `
            return await this.db.any(sqlQuery)
        } catch (error) {
            logger.error('ENVIOS', 'obtenerEnvios', [`Error consultando envíos: ${error.message}`])
            throw new PostgresException(500, `Error al consultar envíos en postgres: ${error.message}`)
        }
    }

    async obtenerEnviosPendientesPorPrioridad(): Promise<IEnvioOut[]> {
        try {
            const sqlQuery = `
                            SELECT id,
                                ST_AsGeoJSON(destino)::json AS destino,
                                direccion_destino,
                                ciudad_destino,
                                departamento_destino,
                                peso_carga,
                                sla_entrega,
                                estado,
                                prioridad,
                                created_at,
                                updated_at
                            FROM logistica.envios 
                            WHERE estado = 'pendiente'
                            ORDER BY prioridad DESC, sla_entrega ASC
      `
            return await this.db.any(sqlQuery)
        } catch (error) {
            logger.error('ENVIOS', 'obtenerEnviosPendientesPorPrioridad', [
                `Error consultando envíos pendientes: ${error.message}`,
            ])
            throw new PostgresException(500, `Error al consultar envíos pendientes en postgres: ${error.message}`)
        }
    }

    async obtenerEquipoReparto(idEquipo: string): Promise<IEquipoRepartoOut | null> {
        try {
            const sqlQuery = `
                                SELECT id,
                                    nombre,
                                    id_equipo,
                                    ST_AsGeoJSON(ubicacion_actual)::json AS ubicacion_actual,
                                    direccion,
                                    ciudad,
                                    departamento,
                                    disponibilidad,
                                    created_at,
                                    updated_at
                                FROM logistica.equipos_reparto
                                WHERE id_equipo = $/idEquipo/
                                
                        `
            return await this.db.oneOrNone(sqlQuery, { idEquipo })
        } catch (error) {
            logger.error('EQUIPOS', 'obtenerEquipoReparto', [`Error consultando equipo de reparto: ${error.message}`])
            throw new PostgresException(500, `Error al consultar equipo de reparto en postgres: ${error.message}`)
        }
    }

    async obtenerVehiculoPorEquipo(idEquipo: string): Promise<IVehiculoOut | null> {
        try {
            const sqlQuery = `
                            SELECT id,
                                id_equipo,
                                capacidad_carga,
                                created_at,
                                updated_at
                            FROM logistica.vehiculos
                            WHERE id_equipo = $/idEquipo/
      `
            return await this.db.oneOrNone(sqlQuery, { idEquipo })
        } catch (error) {
            logger.error('VEHICULOS', 'obtenerVehiculoPorEquipo', [`Error consultando vehículo: ${error.message}`])
            throw new PostgresException(500, `Error al consultar vehículo en postgres: ${error.message}`)
        }
    }

    async obtenerCondicionesTraficoClima(): Promise<ITraficoClimaOut[]> {
        try {
            const sqlQuery = `
                                SELECT id,
                                    ST_AsGeoJSON(ubicacion)::json AS ubicacion,
                                    direccion,
                                    ciudad,
                                    departamento,
                                    nivel_trafico,
                                    condiciones_climaticas,
                                    temperatura,
                                    humedad,
                                    created_at
                                FROM logistica.trafico_clima
                                WHERE created_at::DATE = CURRENT_DATE
                                ORDER BY created_at DESC
      `
            return await this.db.any(sqlQuery)
        } catch (error) {
            logger.error('TRAFICO_CLIMA', 'obtenerCondicionesTraficoClima', [
                `Error consultando condiciones de tráfico y clima: ${error.message}`,
            ])
            throw new PostgresException(
                500,
                `Error al consultar condiciones de tráfico y clima en postgres: ${error.message}`,
            )
        }
    }

    async obtenerCondicionTraficoClimaPorUbicacion(
        ciudad: string,
        departamento: string,
    ): Promise<ITraficoClimaOut | null> {
        try {
            const sqlQuery = `
                                SELECT id,
                                    ST_AsGeoJSON(ubicacion)::json AS ubicacion,
                                    direccion,
                                    ciudad,
                                    departamento,
                                    nivel_trafico,
                                    condiciones_climaticas,
                                    temperatura,
                                    humedad,
                                    created_at
                                FROM logistica.trafico_clima
                                WHERE ciudad = $/ciudad/
                                AND departamento = $/departamento/
                                AND created_at::DATE = CURRENT_DATE
                                ORDER BY created_at DESC
                                LIMIT 1
      `
            return await this.db.oneOrNone(sqlQuery, { ciudad, departamento })
        } catch (error) {
            logger.error('TRAFICO_CLIMA', 'obtenerCondicionTraficoClimaPorUbicacion', [
                `Error consultando condición de tráfico y clima por ubicación: ${error.message}`,
            ])
            throw new PostgresException(
                500,
                `Error al consultar condición de tráfico y clima por ubicación en postgres: ${error.message}`,
            )
        }
    }

    async obtenerEventosInesperadosPorEquipoYFecha(idEquipo: string, fecha: Date): Promise<IEventoInesperadoOut[]> {
        try {
            const sqlQuery = `
                                SELECT id,
                                    id_equipo,
                                    descripcion,
                                    tipo,
                                    id_evento,
                                    created_at
                                FROM logistica.eventos_inesperados
                                WHERE id_equipo = $/idEquipo/
                                AND created_at::DATE = $/fecha/::DATE
                                ORDER BY created_at DESC
      `
            return await this.db.any(sqlQuery, { idEquipo, fecha })
        } catch (error) {
            logger.error('EVENTOS', 'obtenerEventosInesperadosPorEquipoYFecha', [
                `Error consultando eventos inesperados: ${error.message}`,
            ])
            throw new PostgresException(500, `Error al consultar eventos inesperados en postgres: ${error.message}`)
        }
    }

    async obtenerEventoInesperado(idEvento: string): Promise<IEventoInesperadoOut | null> {
        try {
            const sqlQuery = `
                            SELECT id,
                                id_equipo,
                                descripcion,
                                tipo,
                                id_evento,
                                created_at
                            FROM logistica.eventos_inesperados
                            WHERE id_evento = $/idEvento/
      `
            return await this.db.oneOrNone(sqlQuery, { idEvento })
        } catch (error) {
            logger.error('EVENTOS', 'obtenerEventoInesperado', [
                `Error consultando evento inesperado: ${error.message}`,
            ])
            throw new PostgresException(500, `Error al consultar evento inesperado en postgres: ${error.message}`)
        }
    }

    async registrarEventoInesperado(
        evento: Omit<IEventoInesperadoOut, 'id' | 'created_at'>,
    ): Promise<IEventoInesperadoOut> {
        try {
            const sqlQuery = `
                                INSERT INTO logistica.eventos_inesperados
                                (id_equipo, descripcion, tipo, id_evento)
                                VALUES
                                ($/id_equipo/, $/descripcion/, $/tipo/, uuid_generate_v4())
                                RETURNING id, id_equipo, descripcion, tipo, id_evento, created_at
      `
            return await this.db.one(sqlQuery, evento)
        } catch (error) {
            logger.error('EVENTOS', 'registrarEventoInesperado', [
                `Error registrando evento inesperado: ${error.message}`,
            ])
            throw new PostgresException(500, `Error al registrar evento inesperado en postgres: ${error.message}`)
        }
    }

    async guardarRutaOptimizada(ruta: Omit<IOptimizacionRutaOut, 'id' | 'created_at'>): Promise<IOptimizacionRutaOut> {
        try {
            const sqlQuery = `
                                INSERT INTO logistica.optimizacion_rutas
                                (id_equipo, fecha, ruta_optima, id_evento)
                                VALUES
                                ($/id_equipo/, $/fecha/, $/ruta_optima/, $/id_evento/)
                                RETURNING id, id_equipo, fecha, ruta_optima, id_evento, created_at
                            `
            return await this.db.one(sqlQuery, {
                id_equipo: ruta.id_equipo,
                fecha: ruta.fecha,
                ruta_optima: JSON.stringify(ruta.ruta_optima),
                id_evento: ruta.id_evento,
            })
        } catch (error) {
            logger.error('RUTAS_OPTIMIZADAS', 'guardarRutaOptimizada', [
                `Error guardando ruta optimizada: ${error.message}`,
            ])
            throw new PostgresException(500, `Error al guardar ruta optimizada en postgres: ${error.message}`)
        }
    }

    async actualizarRutaOptimizada(
        id: string,
        ruta: Partial<IOptimizacionRutaOut>,
    ): Promise<IOptimizacionRutaOut | null> {
        try {
            const updateFields: string[] = []
            const params: UpdateParams = { id }

            if (ruta.ruta_optima) {
                updateFields.push('ruta_optima = $/ruta_optima/')
                params.ruta_optima = JSON.stringify(ruta.ruta_optima)
            }

            if (ruta.id_evento) {
                updateFields.push('id_evento = $/id_evento/')
                params.id_evento = ruta.id_evento
            }

            if (updateFields.length === 0) {
                return null
            }

            const sqlQuery = `
                        UPDATE logistica.optimizacion_rutas
                        SET ${updateFields.join(', ')}
                        WHERE id = $/id/
                        RETURNING id, id_equipo, fecha, ruta_optima, id_evento, created_at
      `
            return await this.db.oneOrNone(sqlQuery, params)
        } catch (error) {
            logger.error('RUTAS_OPTIMIZADAS', 'actualizarRutaOptimizada', [
                `Error actualizando ruta optimizada: ${error.message}`,
            ])
            throw new PostgresException(500, `Error al actualizar ruta optimizada en postgres: ${error.message}`)
        }
    }
}
