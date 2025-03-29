import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer'
import { cm } from '@infrastructure/bd/adapter/Config'
import { IDatabase, IMain } from 'pg-promise'
import PostgresRutasOptimizadasRepository from '@infrastructure/bd/dao/PostgresRutasOptimizadasRepository'
import TYPESDEPENDENCIES from './TypesDependencies'
import TemplateController from '../controllers/RutasOptimizadasController'
import ConsultarRutasOptimizadasUseCase from '../usecase/services/ConsultarRutasOptimasUseCase'
import { RutasOptimizadasRepository } from '../domain/repositories/RutasOptimizadasRepository'

const createDependencies = (): void => {
    DEPENDENCY_CONTAINER.bind<TemplateController>(TYPESDEPENDENCIES.RutasOptimizadasControllerController)
        .to(TemplateController)
        .inSingletonScope()
    DEPENDENCY_CONTAINER.bind<ConsultarRutasOptimizadasUseCase>(TYPESDEPENDENCIES.ConsultarRutasOptimizadasUseCase)
        .toDynamicValue(() => {
            return new ConsultarRutasOptimizadasUseCase()
        })
        .inSingletonScope()
    DEPENDENCY_CONTAINER.bind<IDatabase<IMain>>(TYPESDEPENDENCIES.dbCm).toConstantValue(cm)
    DEPENDENCY_CONTAINER.bind<RutasOptimizadasRepository>(TYPESDEPENDENCIES.PostgresRutasOptimizadasRepository)
        .to(PostgresRutasOptimizadasRepository)
        .inSingletonScope()
}

export default createDependencies
