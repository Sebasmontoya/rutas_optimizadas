import { IDepartamentoOut } from '@modules/RutasOptimizadas/usecase/dto/out'

export interface RutasOptimizadasRepository {
    obtenerRutaOptimaExistente(idEquipo: number): Promise<IDepartamentoOut[]>
}
