import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer';
import { TYPESDEPENDENCIES } from './TypesDependencies';
import { Controller } from '@modules/shared/infrastructure';
import { IntentoSEntregaController } from '../controllers';
import { RegistrarIntentosEntregaUseCase } from '../usecase/services/RegistrarNovedadUseCase';
import { PostgresExampleRepository } from '@infrastructure/bd/dao/PostgresExampleRepository';
import { RegistroNovedadRepository } from '../domain/repositories';

export const createDependencies = (): void => {
    DEPENDENCY_CONTAINER.bind<Controller>(TYPESDEPENDENCIES.IntentosEntregaController)
        .to(IntentoSEntregaController)
        .inSingletonScope();
    DEPENDENCY_CONTAINER.bind<RegistrarIntentosEntregaUseCase>(TYPESDEPENDENCIES.RegistrarIntentosEntregaUseCase)
        .to(RegistrarIntentosEntregaUseCase)
        .inSingletonScope();
    DEPENDENCY_CONTAINER.bind<RegistroNovedadRepository>(TYPESDEPENDENCIES.RegistroIntentoEntregaRepository)
        .to(PostgresExampleRepository)
        .inSingletonScope();
};
