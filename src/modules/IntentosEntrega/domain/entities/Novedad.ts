export class Novedad {
    id: number;
    descripcion: string;
    visible_tracking: boolean;
    intento_entrega: boolean;
    observacion: string | null;

    constructor(
        id: number,
        descripcion: string,
        visible_tracking: boolean,
        intento_entrega: boolean,
        observacion: string | null,
    ) {
        this.id = id;
        this.descripcion = descripcion;
        this.visible_tracking = visible_tracking;
        this.intento_entrega = intento_entrega;
        this.observacion = observacion;
    }

    static build(
        id: number,
        descripcion: string,
        visible_tracking: boolean,
        intento_entrega: boolean,
        observacion: string | null,
    ): Novedad {
        return new Novedad(id, descripcion, visible_tracking, intento_entrega, observacion);
    }
}
