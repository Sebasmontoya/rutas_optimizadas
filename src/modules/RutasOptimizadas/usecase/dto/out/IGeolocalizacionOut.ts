export interface IPaisOut {
    id_pais: number
    nombre: string
    codigo_iata: string
    codigo_iso: string
    codigo_pais: number
}

export interface IDepartamentoOut {
    id_departamento: number
    nombre: string
    abreviado: string
    id_pais: number
    codigo_departamento: number
}

export interface ICiudadOut {
    id_ciudad: number
    nombre: string
    codigo_ciudad: string
    codigo_dane: string
    codigo_postal: string
    id_departamento: number
}

export interface ITipoViaOut {
    id_tipo_via: number
    descripcion: string
    formato_detallado: boolean
}
