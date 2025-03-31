export interface IEquipoIn {
    idEquipo: string
}

export interface ICalcularRutaOptimaIn {
    idEquipo: string
}

export interface IReplanificarRutaIn {
    idEquipo: string
    idEvento: string
}

export interface IEventoInesperadoIn {
    idEquipo: string
    descripcion: string
    tipo: 'trafico' | 'clima' | 'vehiculo'
    id_evento?: string
}
