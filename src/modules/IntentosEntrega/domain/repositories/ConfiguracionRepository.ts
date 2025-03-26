import { Configuracion } from '../entities/Configuracion';

export interface ConfiguracionRepository {
    obtenerPorIdNovedad(id: number): Promise<Configuracion | null>;
}
