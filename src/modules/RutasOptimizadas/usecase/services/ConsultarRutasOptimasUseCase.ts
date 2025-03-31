// src/modules/RutasOptimizadas/usecase/services/ConsultarRutasOptimasUseCase.ts
import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer'
import { RutasOptimizadasRepository } from '@modules/RutasOptimizadas/domain/repositories/RutasOptimizadasRepository'
import TYPESDEPENDENCIES from '@modules/RutasOptimizadas/dependencies/TypesDependencies'
import { logger } from '@common/logger'
import RutaOptimizadaException from '@common/http/exceptions/RutaOptimizadaException'
import OpenRouteService from '@modules/RutasOptimizadas/domain/services/OpenRouteService'
import redisClient from '@infrastructure/redis/RedisClient'
import { IEnvioOut, IOptimizacionRutaOut, IEventoInesperadoOut } from '../dto/out'
import { IEquipoIn, ICalcularRutaOptimaIn, IReplanificarRutaIn, IEventoInesperadoIn } from '../dto/in'

export default class ConsultarRutasOptimizadasUseCase {
    private rutasOptimizadasRepository = DEPENDENCY_CONTAINER.get<RutasOptimizadasRepository>(
        TYPESDEPENDENCIES.PostgresRutasOptimizadasRepository,
    )

    /**
     * Consulta la ruta óptima existente para un equipo
     * Si no existe una ruta, devuelve los envíos pendientes
     */
    async execute(data: IEquipoIn): Promise<IOptimizacionRutaOut | IEnvioOut[]> {
        try {
            logger.info('RUTAS_OPTIMIZADAS', 'execute', [`Consultando ruta óptima para equipo ${data.idEquipo}`])

            const cacheKey = `ruta_optima:${data.idEquipo}`

            const rutaCache = await redisClient.get(cacheKey)
            if (rutaCache) {
                return JSON.parse(rutaCache) as IOptimizacionRutaOut
            }
            const rutaOptimizada = await this.rutasOptimizadasRepository.obtenerRutaOptimaExistente(data.idEquipo)

            await redisClient.setEx(cacheKey, 1800, JSON.stringify(rutaOptimizada))

            if (!rutaOptimizada) {
                logger.info('RUTAS_OPTIMIZADAS', 'execute', [
                    `No se encontró ruta óptima para equipo ${data.idEquipo}, retornando envíos pendientes`,
                ])
            }

            logger.info('RUTAS_OPTIMIZADAS', 'execute', [`Ruta óptima encontrada para equipo ${data.idEquipo}`])
            return rutaOptimizada ?? []
        } catch (error) {
            logger.error('RUTAS_OPTIMIZADAS', 'execute', [`Error consultando ruta óptima: ${error.message}`])
            throw error
        }
    }

    async calcularRutaOptima(data: ICalcularRutaOptimaIn): Promise<IOptimizacionRutaOut> {
        try {
            logger.info('RUTAS_OPTIMIZADAS', 'calcularRutaOptima', [
                `Calculando ruta óptima para equipo ${data.idEquipo}`,
            ])

            const rutaExistente = await this.rutasOptimizadasRepository.obtenerRutaOptimaExistente(data.idEquipo)

            if (rutaExistente) {
                logger.info('RUTAS_OPTIMIZADAS', 'calcularRutaOptima', [
                    `Ya existe una ruta calculada hoy para equipo ${data.idEquipo}`,
                ])
                return rutaExistente
            }

            // Recopilar todos los datos necesarios para la optimización
            const [equipo, vehiculo, enviosPendientes, condicionesTrafico] = await Promise.all([
                this.rutasOptimizadasRepository.obtenerEquipoReparto(data.idEquipo),
                this.rutasOptimizadasRepository.obtenerVehiculoPorEquipo(data.idEquipo),
                this.rutasOptimizadasRepository.obtenerEnviosPendientesPorPrioridad(),
                this.rutasOptimizadasRepository.obtenerCondicionesTraficoClima(),
            ])

            if (!equipo) {
                throw new RutaOptimizadaException(400, `Equipo de reparto con ID ${data.idEquipo} no encontrado`)
            }

            if (!vehiculo) {
                throw new RutaOptimizadaException(400, `No se encontró vehículo asignado al equipo ${data.idEquipo}`)
            }

            if (enviosPendientes.length === 0) {
                throw new RutaOptimizadaException(400, 'No hay envíos pendientes para optimizar')
            }

            if (!equipo.disponibilidad) {
                throw new RutaOptimizadaException(400, `El equipo ${data.idEquipo} no está disponible actualmente`)
            }

            // Llamar a la API externa - usando el nuevo formato con objeto de parámetros
            const optimizationResponse = await OpenRouteService.calcularRutaOptima({
                vehiculo,
                equipo,
                envios: enviosPendientes,
                condicionesTrafico,
            })

            // Procesar la respuesta
            const rutaOptima = OpenRouteService.procesarRespuestaOptimizacion(
                optimizationResponse,
                data.idEquipo,
                enviosPendientes,
            )

            // Guardar en la base de datos
            const rutaGuardada = await this.rutasOptimizadasRepository.guardarRutaOptimizada(rutaOptima)

            logger.info('RUTAS_OPTIMIZADAS', 'calcularRutaOptima', [
                `Ruta óptima calculada y guardada con éxito para equipo ${data.idEquipo}`,
            ])
            return rutaGuardada
        } catch (error) {
            logger.error('RUTAS_OPTIMIZADAS', 'calcularRutaOptima', [`Error calculando ruta óptima: ${error.message}`])

            if (error instanceof RutaOptimizadaException) {
                throw error
            }

            throw new RutaOptimizadaException(500, `Error al calcular ruta óptima: ${error.message}`)
        }
    }

    /**
     * Replanifica una ruta debido a un evento inesperado
     * Solo se puede hacer si hay un evento inesperado registrado en el día
     */
    async replanificarRuta(data: IReplanificarRutaIn): Promise<IOptimizacionRutaOut> {
        try {
            logger.info('RUTAS_OPTIMIZADAS', 'replanificarRuta', [
                `Iniciando replanificación de ruta para equipo ${data.idEquipo} por evento ${data.idEvento}`,
            ])
            const evento = await this.rutasOptimizadasRepository.obtenerEventoInesperado(data.idEvento)
            if (!evento) {
                throw new RutaOptimizadaException(404, `Evento inesperado con ID ${data.idEvento} no encontrado`)
            }

            const eventDate = new Date(evento.created_at ?? '')
            const today = new Date()

            logger.info('RUTAS_OPTIMIZADAS', 'replanificarRuta', [`eventDate: ${eventDate}`])

            if (eventDate.toDateString() !== today.toDateString()) {
                throw new RutaOptimizadaException(400, 'Solo se puede replanificar por eventos ocurridos hoy')
            }

            if (evento.id_equipo !== data.idEquipo) {
                throw new RutaOptimizadaException(400, 'El evento no corresponde al equipo especificado')
            }

            // Obtener la ruta actual
            const rutaActual = await this.rutasOptimizadasRepository.obtenerRutaOptimaExistente(data.idEquipo)

            if (!rutaActual) {
                throw new RutaOptimizadaException(404, 'No hay una ruta previa calculada hoy para replanificar')
            }

            // Recopilar todos los datos actualizados
            const [equipo, vehiculo, enviosPendientes, condicionesTrafico] = await Promise.all([
                this.rutasOptimizadasRepository.obtenerEquipoReparto(data.idEquipo),
                this.rutasOptimizadasRepository.obtenerVehiculoPorEquipo(data.idEquipo),
                this.rutasOptimizadasRepository.obtenerEnviosPendientesPorPrioridad(),
                this.rutasOptimizadasRepository.obtenerCondicionesTraficoClima(),
            ])

            if (!equipo || !vehiculo || enviosPendientes.length === 0) {
                throw new RutaOptimizadaException(404, 'Faltan datos necesarios para la replanificación')
            }

            if (!equipo.disponibilidad) {
                throw new RutaOptimizadaException(400, `El equipo ${data.idEquipo} no está disponible actualmente`)
            }

            // Llamar a la API externa con el evento inesperado - usando nuevo formato con objeto
            const optimizationResponse = await OpenRouteService.calcularRutaOptima({
                vehiculo,
                equipo,
                envios: enviosPendientes,
                condicionesTrafico,
                eventoInesperado: evento,
            })

            // Procesar la respuesta
            const nuevaRuta = OpenRouteService.procesarRespuestaOptimizacion(
                optimizationResponse,
                data.idEquipo,
                enviosPendientes,
                data.idEvento,
            )

            // Guardar en la base de datos
            const rutaGuardada = await this.rutasOptimizadasRepository.guardarRutaOptimizada(nuevaRuta)

            logger.info('RUTAS_OPTIMIZADAS', 'replanificarRuta', [
                `Ruta replanificada exitosamente para equipo ${data.idEquipo} por evento ${data.idEvento}`,
            ])
            return rutaGuardada
        } catch (error) {
            logger.error('RUTAS_OPTIMIZADAS', 'replanificarRuta', [`Error replanificando ruta: ${error.message}`])

            if (error instanceof RutaOptimizadaException) {
                throw error
            }

            throw new RutaOptimizadaException(500, `Error al replanificar ruta: ${error.message}`)
        }
    }

    /**
     * Registra un evento inesperado
     */
    async registrarEventoInesperado(data: IEventoInesperadoIn): Promise<IEventoInesperadoOut> {
        try {
            logger.info('EVENTOS', 'registrarEventoInesperado', [`Registrando evento inesperado tipo: ${data.tipo}`])

            // Verificar que el equipo existe
            const equipo = await this.rutasOptimizadasRepository.obtenerEquipoReparto(data.idEquipo)

            if (!equipo) {
                throw new RutaOptimizadaException(404, `Equipo de reparto con ID ${data.idEquipo} no encontrado`)
            }

            // Registrar evento
            const evento = await this.rutasOptimizadasRepository.registrarEventoInesperado({
                id_equipo: data.idEquipo,
                descripcion: data.descripcion,
                tipo: data.tipo,
                id_evento: data.id_evento,
            })

            logger.info('EVENTOS', 'registrarEventoInesperado', [`Evento inesperado registrado con ID: ${evento.id}`])
            return evento
        } catch (error) {
            logger.error('EVENTOS', 'registrarEventoInesperado', [
                `Error registrando evento inesperado: ${error.message}`,
            ])

            if (error instanceof RutaOptimizadaException) {
                throw error
            }

            throw new RutaOptimizadaException(500, `Error al registrar evento inesperado: ${error.message}`)
        }
    }
}
