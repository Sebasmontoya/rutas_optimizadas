import { Novedad } from '../entities/Novedad';

export interface validateDataRepository {
    validateData(data: Novedad): Promise<boolean>;
}
