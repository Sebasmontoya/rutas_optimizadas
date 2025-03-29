import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer'
import { RutasOptimizadasRepository } from '@modules/RutasOptimizadas/domain/repositories/RutasOptimizadasRepository'
import TYPESDEPENDENCIES from '@modules/RutasOptimizadas/dependencies/TypesDependencies'
import { IEquipoIn } from '../dto/in'
import { IDepartamentoOut } from '../dto/out'

export default class ConsultarRutasOptimizadasUseCase {
    private rutasOptimizadasRepository = DEPENDENCY_CONTAINER.get<RutasOptimizadasRepository>(
        TYPESDEPENDENCIES.PostgresRutasOptimizadasRepository,
    )

    async execute(data: IEquipoIn): Promise<IDepartamentoOut[] | null> {
        const departamentos = await this.rutasOptimizadasRepository.obtenerRutaOptimaExistente(data.idEquipo)
        return departamentos
    }
}
