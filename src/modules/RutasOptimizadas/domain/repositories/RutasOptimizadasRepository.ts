import {
    IEnvioOut,
    IEquipoRepartoOut,
    IEventoInesperadoOut,
    IOptimizacionRutaOut,
    ITraficoClimaOut,
    IVehiculoOut,
} from '@modules/RutasOptimizadas/usecase/dto/out'

export interface RutasOptimizadasRepository {
    // Consultas de rutas optimizadas
    obtenerRutaOptimaExistente(idEquipo: string): Promise<IOptimizacionRutaOut | null>

    // Consultas de envíos
    obtenerEnvios(): Promise<IEnvioOut[]>
    obtenerEnviosPendientesPorPrioridad(): Promise<IEnvioOut[]>

    // Consultas de equipos y vehículos
    obtenerEquipoReparto(idEquipo: string): Promise<IEquipoRepartoOut | null>
    obtenerVehiculoPorEquipo(idEquipo: string): Promise<IVehiculoOut | null>

    // Consultas de condiciones de tráfico y clima
    obtenerCondicionesTraficoClima(): Promise<ITraficoClimaOut[]>
    obtenerCondicionTraficoClimaPorUbicacion(ciudad: string, departamento: string): Promise<ITraficoClimaOut | null>

    // Gestión de eventos inesperados
    obtenerEventosInesperadosPorEquipoYFecha(idEquipo: string, fecha: Date): Promise<IEventoInesperadoOut[]>
    obtenerEventoInesperado(idEvento: string): Promise<IEventoInesperadoOut | null>
    registrarEventoInesperado(evento: Omit<IEventoInesperadoOut, 'id' | 'created_at'>): Promise<IEventoInesperadoOut>

    // Gestión de rutas optimizadas
    guardarRutaOptimizada(ruta: Omit<IOptimizacionRutaOut, 'id' | 'created_at'>): Promise<IOptimizacionRutaOut>
    actualizarRutaOptimizada(id: string, ruta: Partial<IOptimizacionRutaOut>): Promise<IOptimizacionRutaOut | null>
}
