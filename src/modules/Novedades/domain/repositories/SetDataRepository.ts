import { ISolucionNovedad } from '@modules/Novedades/usecase/dto/out/ISolucionNovedad';
import { Novedad } from '../entities/Novedad';
import { INovedadPayload } from '@modules/Novedades/usecase/dto/out/INovedadPayload';

export interface SetDataRepository {
    insertRegistraNovedadPg(data: Novedad): Promise<string | null>;
    validateSolutionPG(guia: string): Promise<ISolucionNovedad | undefined>;
    validateNovedadPG(id: number): Promise<boolean | undefined>;
    obtenerNovedadPorNumeroGuia(numero_guia: number): Promise<INovedadPayload>;
}
