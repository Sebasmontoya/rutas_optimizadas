import {
    IEnvioOut,
    IEquipoRepartoOut,
    IEventoInesperadoOut,
    ITraficoClimaOut,
    IVehiculoOut,
} from '@modules/RutasOptimizadas/usecase/dto/out'

export interface RouteStep {
    type: string
    job?: number
    [key: string]: unknown
}

export interface StepTraducido {
    tipo: string
    ubicacion: unknown
    llegada: unknown
    duracion: unknown
    carga: unknown
    tiempoEspera: number
    violaciones: unknown[]
    id?: unknown
    trabajo?: number
    descripcion?: string
    servicio?: number
}

export interface OptimizationParams {
    vehiculo: IVehiculoOut
    equipo: IEquipoRepartoOut
    envios: IEnvioOut[]
    condicionesTrafico: ITraficoClimaOut[]
    eventoInesperado?: IEventoInesperadoOut
}
