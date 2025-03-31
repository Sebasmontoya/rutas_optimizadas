import { injectable } from 'inversify'
import { IReplanificarRutaIn } from '@modules/RutasOptimizadas/usecase/dto/in'
import { IOptimizacionRutaOut } from '@modules/RutasOptimizadas/usecase/dto/out'
import RutaOptimizadaException from '@common/http/exceptions/RutaOptimizadaException'
import OpenRouteService from '@modules/RutasOptimizadas/domain/services/OpenRouteService'
import BaseRutaUseCase from './BaseRutaUseCase'

@injectable()
export default class ReplanificarRutaUseCase extends BaseRutaUseCase {
    async execute(data: IReplanificarRutaIn): Promise<IOptimizacionRutaOut> {
        try {
            this.info('RUTAS_OPTIMIZADAS', 'execute', [
                `Iniciando replanificación de ruta para equipo ${data.idEquipo} por evento ${data.idEvento}`,
            ])
            const evento = await this.rutasOptimizadasRepository.obtenerEventoInesperado(data.idEvento)

            if (!evento) {
                throw new RutaOptimizadaException(404, `Evento inesperado con ID ${data.idEvento} no encontrado`)
            }

            this.validarEvento(evento, data.idEquipo)

            const rutaActual = await this.rutasOptimizadasRepository.obtenerRutaOptimaExistente(data.idEquipo)

            if (!rutaActual) {
                throw new RutaOptimizadaException(404, 'No hay una ruta previa calculada hoy para replanificar')
            }
            const [equipo, vehiculo, enviosPendientes, condicionesTrafico] = await Promise.all([
                this.rutasOptimizadasRepository.obtenerEquipoReparto(data.idEquipo),
                this.rutasOptimizadasRepository.obtenerVehiculoPorEquipo(data.idEquipo),
                this.rutasOptimizadasRepository.obtenerEnviosPendientesPorPrioridad(),
                this.rutasOptimizadasRepository.obtenerCondicionesTraficoClima(),
            ])

            if (!equipo) {
                throw new RutaOptimizadaException(404, `Equipo de reparto con ID ${data.idEquipo} no encontrado`)
            }
            if (!vehiculo) {
                throw new RutaOptimizadaException(404, `No se encontró vehículo asignado al equipo ${data.idEquipo}`)
            }
            this.validarDatos(data.idEquipo, equipo, vehiculo, enviosPendientes)
            const optimizationResponse = await OpenRouteService.calcularRutaOptima({
                vehiculo,
                equipo,
                envios: enviosPendientes,
                condicionesTrafico,
                eventoInesperado: evento,
            })

            const nuevaRuta = OpenRouteService.procesarRespuestaOptimizacion(
                optimizationResponse,
                data.idEquipo,
                enviosPendientes,
                data.idEvento,
            )

            const rutaGuardada = await this.rutasOptimizadasRepository.guardarRutaOptimizada(nuevaRuta)

            this.info('RUTAS_OPTIMIZADAS', 'execute', [
                `Ruta replanificada exitosamente para equipo ${data.idEquipo} por evento ${data.idEvento}`,
            ])
            return rutaGuardada
        } catch (error) {
            this.error('RUTAS_OPTIMIZADAS', 'execute', [`Error replanificando ruta: ${error.message}`])

            if (error instanceof RutaOptimizadaException) {
                throw error
            }

            throw new RutaOptimizadaException(500, `Error al replanificar ruta: ${error.message}`)
        }
    }
}
