import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer';
import { AxiosRepository } from '@common/http/repositories/AxiosRepository';
import { TYPESDEPENDENCIES } from '@modules/Novedades/dependencies/TypesDependencies';
import { SetDataRepository } from '@modules/Novedades/domain/repositories/SetDataRepository';
import { injectable } from 'inversify';
import { IRegisterIn } from '../dto/in/IRegisterIn';

@injectable()
export class ValidateDataUseCase {
    private axios = DEPENDENCY_CONTAINER.get<AxiosRepository>(TYPESDEPENDENCIES.AxiosRepository);
    private setDataRepository = DEPENDENCY_CONTAINER.get<SetDataRepository>(TYPESDEPENDENCIES.SetDataRepository);

    async validate(data: IRegisterIn): Promise<boolean> {
        const tasks = [this.setDataRepository.validateNovedadPG(data.id_novedad), this.validateEquipoTerminal(data)];
        try {
            const results = await Promise.all(tasks);
            const allTasksResponse = results.every((result) => result === true);
            return allTasksResponse;
        } catch (error) {
            throw new Error(`Una validacion falló, ${error}`);
        }
    }

    async validateEquipoTerminal(data: IRegisterIn): Promise<boolean> {
        try {
            const response = await this.axios.getDataFromUrl(
                `https://api-testing.coordinadora.com/ms-equipos-consulta/api/v1/equipo?terminal=${data.codigo_terminal_registro}&codigo_equipo=${data.equipo_registra}`,
            );
            if (response.data.isError) {
                throw new Error(`${response.data.data}`);
            } else {
                return !response.data.isError;
            }
        } catch (error) {
            throw new Error(`Error consultando api de equipo y terminal: ${error}`);
        }
    }
    async validateWorker(url: string): Promise<boolean | null> {
        this.axios
            .getDataFromUrl(url)
            .then((response) => {
                return response.data;
            })
            .catch((_error) => {
                return false;
            });
        return null;
    }
    async validateTeaml(url: string): Promise<boolean | null> {
        this.axios
            .getDataFromUrl(url)
            .then((response) => {
                return response.data;
            })
            .catch((_error) => {
                return false;
            });
        return null;
    }
}
