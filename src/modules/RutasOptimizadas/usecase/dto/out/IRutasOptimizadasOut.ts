export interface IDepartamentoOut {
    id_departamento: number
    nombre: string
    abreviado: string
    id_pais: number
    codigo_departamento: number
}

export interface IEnvioOut {
    destino: PuntoGeografico
    direccion_destino: string
    ciudad_destino: string
    departamento_destino: string
    peso_carga: number
    sla_entrega: string
    estado: 'pendiente' | 'en_ruta' | 'fallido'
    prioridad: boolean
}

export type PuntoGeografico = {
    type: 'Point'
    coordinates: [lon: number, lat: number]
}
