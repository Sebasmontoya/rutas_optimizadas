export class RegistroNovedad {
    numero_guia: string;
    id_novedad: number;
    fecha_hora_registro_novedad: Date;
    empleado_registra: number;
    fuente_registro: string;
    observaciones_novedad: string;

    constructor(
        numero_guia: string,
        id_novedad: number,
        fecha_hora_registro_novedad: Date,
        empleado_registra: number,
        fuente_registro: string,
        observaciones_novedad: string,
    ) {
        this.numero_guia = numero_guia;
        this.id_novedad = id_novedad;
        this.fecha_hora_registro_novedad = fecha_hora_registro_novedad;
        this.empleado_registra = empleado_registra;
        this.fuente_registro = fuente_registro;
        this.observaciones_novedad = observaciones_novedad;
    }

    static build(
        numero_guia: string,
        id_novedad: number,
        fecha_hora_registro_novedad: Date,
        empleado_registra: number,
        fuente_registro: string,
        observaciones_novedad: string,
    ): RegistroNovedad {
        return new RegistroNovedad(
            numero_guia,
            id_novedad,
            fecha_hora_registro_novedad,
            empleado_registra,
            fuente_registro,
            observaciones_novedad,
        );
    }
}
