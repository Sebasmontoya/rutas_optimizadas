export interface NovedadRepository {
    existeNovedadPorIdYPermiteIntentoEngrega(id: number): Promise<boolean>;
}
