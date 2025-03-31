import { injectable } from 'inversify'
import { ICalcularRutaOptimaIn } from '@modules/RutasOptimizadas/usecase/dto/in'
import { IOptimizacionRutaOut } from '@modules/RutasOptimizadas/usecase/dto/out'
import OpenRouteService from '@modules/RutasOptimizadas/domain/services/OpenRouteService'
import RutaOptimizadaException from '@common/http/exceptions/RutaOptimizadaException'
import BaseRutaUseCase from './BaseRutaUseCase'

@injectable()
export default class CalcularRutaOptimizadaUseCase extends BaseRutaUseCase {
    async execute(data: ICalcularRutaOptimaIn): Promise<IOptimizacionRutaOut> {
        try {
            this.info('RUTAS_OPTIMIZADAS', 'execute', [`Calculando ruta óptima para equipo ${data.idEquipo}`])

            // Verificar si ya se calculó una ruta hoy
            const rutaExistente = await this.rutasOptimizadasRepository.obtenerRutaOptimaExistente(data.idEquipo)

            if (rutaExistente) {
                this.info('RUTAS_OPTIMIZADAS', 'execute', [
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
                throw new RutaOptimizadaException(404, `Equipo de reparto con ID ${data.idEquipo} no encontrado`)
            }
            if (!vehiculo) {
                throw new RutaOptimizadaException(404, `No se encontró vehículo asignado al equipo ${data.idEquipo}`)
            }
            this.validarDatos(data.idEquipo, equipo, vehiculo, enviosPendientes)

            // Llamar directamente al servicio de OpenRouteService con el nuevo formato de parámetros
            const optimizationResponse = await OpenRouteService.calcularRutaOptima({
                vehiculo,
                equipo,
                envios: enviosPendientes,
                condicionesTrafico,
            })

            // Procesar la respuesta usando el servicio
            const rutaOptima = OpenRouteService.procesarRespuestaOptimizacion(
                optimizationResponse,
                data.idEquipo,
                enviosPendientes,
            )

            // Guardar en la base de datos
            const rutaGuardada = await this.rutasOptimizadasRepository.guardarRutaOptimizada(rutaOptima)

            this.info('RUTAS_OPTIMIZADAS', 'execute', [
                `Ruta óptima calculada y guardada con éxito para equipo ${data.idEquipo}`,
            ])
            return rutaGuardada
        } catch (error) {
            this.error('RUTAS_OPTIMIZADAS', 'execute', [`Error calculando ruta óptima: ${error.message}`])

            if (error instanceof RutaOptimizadaException) {
                throw error
            }

            throw new RutaOptimizadaException(500, `Error al calcular ruta óptima: ${error.message}`)
        }
    }
}
