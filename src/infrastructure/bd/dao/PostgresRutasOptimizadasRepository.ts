import 'reflect-metadata'
import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer'
import PostgresException from '@common/http/exceptions/PostgresException'
import { logger } from '@common/logger'
import TYPESDEPENDENCIES from '@modules/RutasOptimizadas/dependencies/TypesDependencies'
import { RutasOptimizadasRepository } from '@modules/RutasOptimizadas/domain/repositories/RutasOptimizadasRepository'
import { injectable } from 'inversify'
import { IDatabase, IMain } from 'pg-promise'
import { IDepartamentoOut, IEnvioOut } from '@modules/RutasOptimizadas/usecase/dto/out'

@injectable()
export default class PostgresRutasOptimizadasRepository implements RutasOptimizadasRepository {
    db = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(TYPESDEPENDENCIES.dbCm)

    async obtenerRutaOptimaExistente(id_equipo: number): Promise<IDepartamentoOut[] | []> {
        try {
            const sqlQuery = `SELECT opr.ruta_optima
                                FROM logistica.optimizacion_rutas opr
                                WHERE opr.id = $/id_equipo/
                                AND opr.ruta_optima IS NOT NULL
                                AND opr.fecha::DATE = CURRENT_DATE - 1`
            const result = await this.db.any(sqlQuery, { id_equipo })

            return result
        } catch (error) {
            logger.error('Rutas', 'KEY', [`Error consltando departamentos: ${error.message}`])
            throw new PostgresException(500, `Error al consultar data en postgress: ${error.message}`)
        }
    }

    async obtenerEnvios(): Promise<IEnvioOut[] | []> {
        try {
            const sqlQuery = `SELECT ST_AsGeoJSON(e.destino)::json AS destino,
                                e.direccion_destino,
                                e.ciudad_destino,
                                e.departamento_destino,
                                e.peso_carga,
                                e.sla_entrega,
                                e.estado,
                                e.estado,
                                e.prioridad
                            FROM logistica.envios e
                            WHERE e.estado != 'entregado' limit 10`
            const result = await this.db.any(sqlQuery)

            return result
        } catch (error) {
            logger.error('ENVIOS', 'KEY', [`Error consultando envíos: ${error.message}`])
            throw new PostgresException(500, `Error al consultar envíos en postgres: ${error.message}`)
        }
    }
}
