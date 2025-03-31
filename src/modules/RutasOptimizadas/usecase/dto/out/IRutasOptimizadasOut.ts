export interface IDepartamentoOut {
    id_departamento: number
    nombre: string
    abreviado: string
    id_pais: number
    codigo_departamento: number
}

export interface IEnvioOut {
    id: string
    destino: PuntoGeografico
    direccion_destino: string
    ciudad_destino: string
    departamento_destino: string
    peso_carga: number
    sla_entrega: string
    estado: 'pendiente' | 'en_ruta' | 'entregado' | 'fallido' | 'cancelado'
    prioridad: number
    created_at?: Date
    updated_at?: Date
}

export interface IEquipoRepartoOut {
    id: string
    nombre: string
    id_equipo: string
    ubicacion_actual: PuntoGeografico
    direccion: string
    ciudad: string
    departamento: string
    disponibilidad: boolean
    created_at?: Date
    updated_at?: Date
}

export interface IVehiculoOut {
    id: string
    id_equipo: string
    capacidad_carga: number
    created_at?: Date
    updated_at?: Date
}

export interface ITraficoClimaOut {
    id: string
    ubicacion: PuntoGeografico
    direccion: string
    ciudad: string
    departamento: string
    nivel_trafico: number // 1-10
    condiciones_climaticas: string // 'despejado', 'nublado', 'lluvia', 'tormenta', 'nieve'
    temperatura: number
    humedad: number
    created_at?: Date
}

export interface IEventoInesperadoOut {
    id: string
    id_equipo: string
    descripcion: string
    tipo: 'trafico' | 'clima' | 'vehiculo'
    id_evento?: string
    created_at?: Date
    speed_factor?: number // Factor de velocidad ajustado por evento
}

// Definir un tipo para los pasos de ruta
export interface RouteStep {
    type: string
    location?: [number, number]
    job?: number
    service?: number
    arrival?: number
    duration?: number
    distance?: number
    description?: string
    [key: string]: unknown // Para propiedades adicionales no especificadas
}

export interface IOptimizacionRutaOut {
    id?: string
    id_equipo: string
    fecha: Date
    ruta_optima: {
        envios: string[] // IDs de los envíos en orden de entrega
        duracion_total: number
        steps: RouteStep[]
    }
    id_evento?: string
    created_at?: Date
}

export type PuntoGeografico = {
    type: 'Point'
    coordinates: [lon: number, lat: number]
}

// Definición de tipos para la respuesta de la API de OpenRouteService
export interface OptimizationViolation {
    type: string
    description: string
    [key: string]: unknown
}

export interface OptimizationRouteStep {
    type: string // 'start', 'job', 'break', 'end'
    location: [number, number]
    description?: string
    id?: number
    service?: number
    waiting_time?: number
    job?: number
    load?: number[]
    arrival?: number
    duration?: number
    violations?: OptimizationViolation[]
}

export interface OptimizationRoute {
    vehicle: number
    cost: number
    description: string
    delivery: number[]
    amount: number[]
    pickup: number[]
    service: number
    duration: number
    distance: number
    waiting_time: number
    priority: number
    steps: OptimizationRouteStep[]
    violations: OptimizationViolation[]
}

export interface OptimizationUnassigned {
    id: number
    description: string
}

export interface OptimizationComputingTimes {
    loading: number
    solving: number
    routing: number
}

// Respuesta API OpenRouteService
export interface OptimizationResponse {
    code: number
    summary: {
        cost: number
        routes: number
        unassigned: number
        delivery: number[]
        amount: number[]
        pickup: number[]
        service: number
        duration: number
        waiting_time: number
        priority: number
        violations: OptimizationViolation[]
        computing_times: OptimizationComputingTimes
    }
    routes: OptimizationRoute[]
    unassigned?: OptimizationUnassigned[]
}
