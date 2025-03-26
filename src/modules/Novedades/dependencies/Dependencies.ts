import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer';
import { TYPESDEPENDENCIES } from './TypesDependencies';
import { Controller } from '@modules/shared/infrastructure';
import StatusGetController from '../controllers/StatusGetController';
import { NovedadesController } from '../controllers';
import { SetDataRepository } from '../domain/repositories/SetDataRepository';
import { PostgressDao } from '@infrastructure/bd/dao/PostgressDao';
import { ValidateDataUseCase } from '../usecase/services/ValidateDataUseCase';
import { AxiosRepository } from '@common/http/repositories/AxiosRepository';
import { apiServiceAxios } from '@common/http/services/apiServiceAxios';
import { cm } from '@infrastructure/bd/adapter/Config';
import { IDatabase, IMain } from 'pg-promise';
import { RegistrarNovedadUseCase } from '../usecase/services/RegistrarNovedadUseCase';

export const createDependencies = (): void => {
    DEPENDENCY_CONTAINER.bind<RegistrarNovedadUseCase>(TYPESDEPENDENCIES.RegistrarNovedadUseCase)
        .to(RegistrarNovedadUseCase)
        .inSingletonScope();
    DEPENDENCY_CONTAINER.bind<IDatabase<IMain>>(TYPESDEPENDENCIES.dbCm).toConstantValue(cm);
    DEPENDENCY_CONTAINER.bind<AxiosRepository>(TYPESDEPENDENCIES.AxiosRepository)
        .to(apiServiceAxios)
        .inSingletonScope();
    DEPENDENCY_CONTAINER.bind<ValidateDataUseCase>(TYPESDEPENDENCIES.ValidateDataUseCase)
        .to(ValidateDataUseCase)
        .inSingletonScope();
    DEPENDENCY_CONTAINER.bind<Controller>(TYPESDEPENDENCIES.NovedadesController)
        .to(NovedadesController)
        .inSingletonScope();
    DEPENDENCY_CONTAINER.bind<Controller>(TYPESDEPENDENCIES.StatusGetController)
        .to(StatusGetController)
        .inSingletonScope();
    DEPENDENCY_CONTAINER.bind<SetDataRepository>(TYPESDEPENDENCIES.SetDataRepository)
        .to(PostgressDao)
        .inSingletonScope();
};
