import { injectable } from 'inversify'
import { IEquipoIn } from '@modules/RutasOptimizadas/usecase/dto/in'
import { IEnvioOut, IOptimizacionRutaOut } from '@modules/RutasOptimizadas/usecase/dto/out'
import BaseRutaUseCase from './BaseRutaUseCase'

@injectable()
export default class ConsultarRutaUseCase extends BaseRutaUseCase {
    async execute(data: IEquipoIn): Promise<IOptimizacionRutaOut | IEnvioOut[]> {
        try {
            this.info('RUTAS_OPTIMIZADAS', 'execute', [`Consultando ruta óptima para equipo ${data.idEquipo}`])

            const rutaOptimizada = await this.rutasOptimizadasRepository.obtenerRutaOptimaExistente(
                data.idEquipo.toString(),
            )

            if (!rutaOptimizada) {
                this.info('RUTAS_OPTIMIZADAS', 'execute', [
                    `No se encontró ruta óptima para equipo ${data.idEquipo}, retornando envíos pendientes`,
                ])
                const envios = await this.rutasOptimizadasRepository.obtenerEnvios()
                return envios
            }

            this.info('RUTAS_OPTIMIZADAS', 'execute', [`Ruta óptima encontrada para equipo ${data.idEquipo}`])
            return rutaOptimizada
        } catch (error) {
            this.error('RUTAS_OPTIMIZADAS', 'execute', [`Error consultando ruta óptima: ${error.message}`])
            throw error
        }
    }
}
