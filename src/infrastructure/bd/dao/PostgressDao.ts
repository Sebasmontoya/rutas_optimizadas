import { injectable } from 'inversify';
import { IDatabase, IMain } from 'pg-promise';
import { SetDataRepository } from '@modules/Novedades/domain/repositories/SetDataRepository';
import { Novedad } from '../../../modules/Novedades/domain/entities/Novedad';
import { ISolucionNovedad } from '@modules/Novedades/usecase/dto/out/ISolucionNovedad';
import { TYPESDEPENDENCIES } from '@modules/Novedades/dependencies/TypesDependencies';
import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer';
import { format } from 'date-fns';
import { INovedadMaster } from '@modules/Novedades/usecase/dto/out/INovedadMaster';
import { INovedadPayload } from '@modules/Novedades/usecase/dto/out/INovedadPayload';
import { PostgresError } from '@common/http/exceptions';
@injectable()
export class PostgressDao implements SetDataRepository {
    dbCm = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(TYPESDEPENDENCIES.dbCm);

    async insertRegistraNovedadPg(data: Novedad): Promise<string | null> {
        const dateFormat = format(data.fecha_hora_registro_novedad, 'yyyy-MM-dd HH:mm:ss');
        try {
            const query = `INSERT INTO registra_novedad`;
            await this.dbCm.query(query);
            await this.insertStageNovedadPg(data);
            return 'enviado correctamente a registra_novedad';
        } catch (err) {
            throw new Error(`Error en insercion de postgres registra_novedad: ${err}`);
        }
    }

    async insertStageNovedadPg(data: Novedad): Promise<string | null> {
        const fecha_registro = format(data.fecha_hora_registro_novedad, 'yyyy-MM-dd HH:mm:ss');
        const payload = {
            codigo_novedad: data.id_novedad,
            fecha_hora_registra_novedad: fecha_registro,
            fuente_registro: data.fuente_registro,
        };
        try {
            const query = `INSERT INTO stage_registra_novedad
            (numero_guia, payload, id_estado_publicacion, estado_publicacion, numero_reintentos_fallidos)
            VALUES('${data.numero_guia}', '${JSON.stringify(payload)}', 1, 'publicado', 0)`;
            await this.dbCm.query(query);
            return 'enviado correctamente a registra_novedad';
        } catch (error) {
            throw new Error(`Error en insercion de postgres en stage_registra_novedad: ${error}`);
        }
    }
    async validateSolutionPG(guia: string): Promise<ISolucionNovedad | undefined> {
        try {
            const query = `SELECT * from soluciones_novedad where numero_guia = '${guia}' ORDER BY fecha_hora_solucion DESC LIMIT 1`;
            const data: ISolucionNovedad = await this.dbCm.query(query);
            return data;
        } catch (error) {
            return undefined;
        }
    }

    async validateNovedadPG(id: number): Promise<boolean | undefined> {
        try {
            const query = `SELECT EXISTS (SELECT 1 FROM novedades WHERE id = ${id})`;
            const data: INovedadMaster[] = await this.dbCm.query(query);
            if (data[0].exists === false) {
                throw new Error(`La novedad no existe en maestro de novedades`);
            }
            return data[0].exists;
        } catch (error) {
            throw new Error(`Error validando novedad postgres: ${error}`);
        }
    }
    async obtenerNovedadPorNumeroGuia(numero_guia: number): Promise<INovedadPayload> {
        try {
            const query = `SELECT estado_reporte, intento_entrega FROM registra_novedad WHERE numero_guia = $1`;
            const data = await this.dbCm.oneOrNone<INovedadPayload>(query, [numero_guia]);
            if (data) {
                return data;
            }
            return {
                estado_reporte: false,
                intento_entrega: 0,
            };
        } catch (error) {
            throw new PostgresError('', error.message);
        }
    }
}
