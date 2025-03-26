export class Configuracion {
    id: number;
    id_novedad: number;
    numero_intentos: number;
    autoriza_reporte: boolean;

    constructor(id: number, id_novedad: number, numero_intentos: number, autoriza_reporte: boolean) {
        this.id = id;
        this.id_novedad = id_novedad;
        this.numero_intentos = numero_intentos;
        this.autoriza_reporte = autoriza_reporte;
    }

    static build(id: number, id_novedad: number, numero_intentos: number, autoriza_reporte: boolean): Configuracion {
        return new Configuracion(id, id_novedad, numero_intentos, autoriza_reporte);
    }
}
