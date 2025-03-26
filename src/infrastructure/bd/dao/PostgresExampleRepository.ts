import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer';
import { Configuracion } from '@modules/IntentosEntrega/domain/entities/Configuracion';
import { IntentoEntregaRepository } from '@modules/IntentosEntrega/domain/repositories/';
import { IStageDetail } from '@modules/IntentosEntrega/usecase/dto/in';
import { TYPESDEPENDENCIES } from '@modules/Novedades/dependencies/TypesDependencies';
import { injectable } from 'inversify';
import { IDatabase, IMain } from 'pg-promise';

@injectable()
export class PostgresExampleRepository implements IntentoEntregaRepository {
    db = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(TYPESDEPENDENCIES.dbCm);
    schema = '"public"';
    async existeNovedadPorIdYPermiteIntentoEngrega(id: number): Promise<boolean> {
        try {
            const sqlQuery = `SELECT id from ${this.schema}.novedades where id = $1 and intento_entrega = true`;
            const novedad = await this.db.oneOrNone(sqlQuery, [id]);
            return !!novedad;
        } catch (error) {
            return false;
        }
    }

    async actualizarIntentoEntrega(numero_guia: number, campo: number): Promise<void> {
        try {
            const sqlQuery = `UPDATE ${this.schema}.registra_novedad SET intento_entrega = $1 WHERE numero_guia = $2`;
            await this.db.none(sqlQuery, [campo, numero_guia]);
        } catch (error) {
            throw new Error(`Error en insercion de postgres registra_novedad: ${error.message}`);
        }
    }

    async actualizarEstadoReporte(numero_guia: number, campo: boolean): Promise<void> {
        try {
            const sqlQuery = `UPDATE ${this.schema}.registra_novedad SET estado_reporte = $1 WHERE numero_guia = $2`;
            await this.db.none(sqlQuery, [campo, numero_guia]);
        } catch (error) {
            throw new Error(`Error en insercion de postgres registra_novedad: ${error.message}`);
        }
    }

    async obtenerPorIdNovedad(id: number): Promise<Configuracion | null> {
        try {
            const sqlQuery = `SELECT * FROM ${this.schema}.configuracion where id_novedad = $1`;
            const configuracion = await this.db.oneOrNone(sqlQuery, [id]);
            return configuracion ? configuracion : null;
        } catch (error) {
            return null;
        }
    }

    async listaIntentosEntregaHoy(numero_guiaZ: number): Promise<IStageDetail[]> {
        try {
            const sqlQuery = `SELECT numero_guia::NUMERIC, (payload->>'codigo_novedad')::NUMERIC as codigo_novedad FROM ${this.schema}.stage_registra_novedad WHERE numero_guia = $1 AND (payload->>'fecha_hora_registra_novedad')::DATE = CURRENT_DATE`;
            const data = await this.db.manyOrNone(sqlQuery, [numero_guiaZ]);
            if (!data) return [];
            return data as IStageDetail[];
        } catch (error) {
            return [];
        }
    }
}
