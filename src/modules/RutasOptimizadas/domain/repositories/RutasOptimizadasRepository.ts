import {
    IEnvioOut,
    IEquipoRepartoOut,
    IEventoInesperadoOut,
    IOptimizacionRutaOut,
    ITraficoClimaOut,
    IVehiculoOut,
} from '@modules/RutasOptimizadas/usecase/dto/out'

export interface RutasOptimizadasRepository {
    obtenerRutaOptimaExistente(idEquipo: string): Promise<IOptimizacionRutaOut | null>
    obtenerEnvios(): Promise<IEnvioOut[]>
    obtenerEnviosPendientesPorPrioridad(): Promise<IEnvioOut[]>
    obtenerEquipoReparto(idEquipo: string): Promise<IEquipoRepartoOut | null>
    obtenerVehiculoPorEquipo(idEquipo: string): Promise<IVehiculoOut | null>
    obtenerCondicionesTraficoClima(): Promise<ITraficoClimaOut[]>
    obtenerCondicionTraficoClimaPorUbicacion(ciudad: string, departamento: string): Promise<ITraficoClimaOut | null>
    obtenerEventosInesperadosPorEquipoYFecha(idEquipo: string, fecha: Date): Promise<IEventoInesperadoOut[]>
    obtenerEventoInesperado(idEvento: string): Promise<IEventoInesperadoOut | null>
    registrarEventoInesperado(evento: Omit<IEventoInesperadoOut, 'id' | 'created_at'>): Promise<IEventoInesperadoOut>
    guardarRutaOptimizada(ruta: Omit<IOptimizacionRutaOut, 'id' | 'created_at'>): Promise<IOptimizacionRutaOut>
    actualizarRutaOptimizada(id: string, ruta: Partial<IOptimizacionRutaOut>): Promise<IOptimizacionRutaOut | null>
}
