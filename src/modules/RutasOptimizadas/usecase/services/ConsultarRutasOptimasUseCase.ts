import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer'
import { RutasOptimizadasRepository } from '@modules/RutasOptimizadas/domain/repositories/RutasOptimizadasRepository'
import TYPESDEPENDENCIES from '@modules/RutasOptimizadas/dependencies/TypesDependencies'
import { IEquipoIn } from '../dto/in'
import { IEnvioOut } from '../dto/out'

export default class ConsultarRutasOptimizadasUseCase {
    private rutasOptimizadasRepository = DEPENDENCY_CONTAINER.get<RutasOptimizadasRepository>(
        TYPESDEPENDENCIES.PostgresRutasOptimizadasRepository,
    )

    async execute(data: IEquipoIn): Promise<IEnvioOut[] | null> {
        const rutaOptimizada = await this.rutasOptimizadasRepository.obtenerRutaOptimaExistente(data.idEquipo)
        if (rutaOptimizada.length === 0) {
            const envios = await this.rutasOptimizadasRepository.obtenerEnvios()

            return envios
        }

        return null
    }
}
