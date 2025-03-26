import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer';
import { TYPESDEPENDENCIES } from '@modules/Novedades/dependencies/TypesDependencies';
import { SetDataRepository } from '@modules/Novedades/domain/repositories/SetDataRepository';
import { injectable } from 'inversify';
import { IRegisterIn } from '../dto/in/IRegisterIn';
import { ValidateDataUseCase } from './ValidateDataUseCase';
import { Novedad } from '../../domain/entities/Novedad';

@injectable()
export class RegistrarNovedadUseCase {
    async insert(data: IRegisterIn): Promise<string | null> {
        const novedadaUseCase = DEPENDENCY_CONTAINER.get<ValidateDataUseCase>(TYPESDEPENDENCIES.ValidateDataUseCase);
        const setDataRepository = DEPENDENCY_CONTAINER.get<SetDataRepository>(TYPESDEPENDENCIES.SetDataRepository);
        const validateData = await novedadaUseCase.validate(data);
        const restPayload = await setDataRepository.obtenerNovedadPorNumeroGuia(+data.numero_guia);
        const refactorData: Novedad = { ...data, ...restPayload };
        if (validateData) {
            const exist = await setDataRepository.validateSolutionPG(data.numero_guia);
            if (exist !== undefined && exist.numero_guia !== undefined) {
                if (exist.id_estado_solucion === 5) {
                    const response = await setDataRepository.insertRegistraNovedadPg(refactorData);
                    return response;
                }
            } else {
                //no existe
                const response = await setDataRepository.insertRegistraNovedadPg(refactorData);
                return response;
            }
        } else if (validateData === false) {
            return 'No paso las validaciones';
        }
        return null;
    }
}
