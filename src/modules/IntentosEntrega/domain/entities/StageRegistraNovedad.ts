export class StageRegistraNovedad {
    numero_guia: number;
    payload: string;
    id_estado_publicacion: number | null;
    estado_publicacion: string;
    numero_reintentos_fallidos: number;

    constructor(
        numero_guia: number,
        payload: string,
        id_estado_publicacion: number | null,
        estado_publicacion: string,
        numero_reintentos_fallidos: number,
    ) {
        this.numero_guia = numero_guia;
        this.payload = payload;
        this.id_estado_publicacion = id_estado_publicacion;
        this.estado_publicacion = estado_publicacion;
        this.numero_reintentos_fallidos = numero_reintentos_fallidos;
    }

    static build(
        numero_guia: number,
        payload: string,
        id_estado_publicacion: number | null,
        estado_publicacion: string,
        numero_reintentos_fallidos: number,
    ): StageRegistraNovedad {
        return new StageRegistraNovedad(
            numero_guia,
            payload,
            id_estado_publicacion,
            estado_publicacion,
            numero_reintentos_fallidos,
        );
    }
}
