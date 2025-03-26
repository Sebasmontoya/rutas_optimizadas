export class EventoCheckpoint {
    tipoEvento: string;
    accion: string;
    codigoEvento: number;
    unidad: string;
    guia: string;

    constructor(tipoEvento: string, accion: string, unidad: string, guia: string, codigoEvento: number) {
        this.tipoEvento = tipoEvento;
        this.accion = accion;
        this.unidad = unidad;
        this.guia = guia;
        this.codigoEvento = codigoEvento;
    }

    static build(
        tipoEvento: string,
        accion: string,
        unidad: string,
        guia: string,
        codigoEvento: number,
    ): EventoCheckpoint {
        return new EventoCheckpoint(tipoEvento, accion, unidad, guia, codigoEvento);
    }
}
