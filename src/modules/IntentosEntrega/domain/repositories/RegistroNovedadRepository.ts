export interface RegistroNovedadRepository {
    actualizarIntentoEntrega(numero_guia: number, campo: number): Promise<void>;
    actualizarEstadoReporte(numero_guia: number, campo: boolean): Promise<void>;
}
