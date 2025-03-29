import 'reflect-metadata'
import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer'
import PostgresException from '@common/http/exceptions/PostgresException'
import { logger } from '@common/logger'
import TYPESDEPENDENCIES from '@modules/RutasOptimizadas/dependencies/TypesDependencies'
import { RutasOptimizadasRepository } from '@modules/RutasOptimizadas/domain/repositories/RutasOptimizadasRepository'
import { injectable } from 'inversify'
import { IDatabase, IMain } from 'pg-promise'
import { IDepartamentoOut } from '@modules/RutasOptimizadas/usecase/dto/out'

@injectable()
export default class PostgresRutasOptimizadasRepository implements RutasOptimizadasRepository {
    db = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(TYPESDEPENDENCIES.dbCm)

    async obtenerRutaOptimaExistente(id_equipo: number): Promise<IDepartamentoOut[] | []> {
        try {
            const sqlQuery = `SELECT opr.ruta_optima
                                FROM logistica.optimizacion_rutas opr
                                WHERE opr.id = $/id_equipo/
                                AND opr.ruta_optima IS NOT NULL
                                AND opr.fecha::DATE = CURRENT_DATE - 1`
            const result = await this.db.any(sqlQuery, { id_equipo })
            console.log('result', result)
            if (result.length === 0) {
                return []
            }

            return result
        } catch (error) {
            logger.error('GEOLOCALIZACION', 'KEY', [`Error consltando departamentos: ${error.message}`])
            throw new PostgresException(500, `Error al consultar data en postgress: ${error.message}`)
        }
    }
}
