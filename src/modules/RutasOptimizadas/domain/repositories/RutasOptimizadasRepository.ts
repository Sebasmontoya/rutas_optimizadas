import { IDepartamentoOut, IEnvioOut } from '@modules/RutasOptimizadas/usecase/dto/out'

export interface RutasOptimizadasRepository {
    obtenerRutaOptimaExistente(idEquipo: number): Promise<IDepartamentoOut[]>
    obtenerEnvios(): Promise<IEnvioOut[]>
}
