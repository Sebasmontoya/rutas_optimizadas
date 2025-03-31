import { Req } from '@modules/shared/infrastructure'
import { injectable } from 'inversify'
import { Response } from '@common/http/Response'

import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer'
import Result from '@common/http/Result'
import { validateData } from '@common/util/Schemas'
import { Status } from '../../shared/infrastructure/Controller'
import TYPESDEPENDENCIES from '../dependencies/TypesDependencies'
import { ICalcularRutaOptimaIn, IEquipoIn, IEventoInesperadoIn, IReplanificarRutaIn } from '../usecase/dto/in'
import ConsultarDepartamentosUseCase from '../usecase/services/ConsultarRutasOptimasUseCase'
import {
    CalcularRutaOptimaSchema,
    ConsultarRutasOptimizadasSchema,
    RegistrarEventoInesperadoSchema,
    ReplanificarRutaSchema,
} from './schemas/RutasOptmizadasSchema'

@injectable()
export default class RutasOptimizadasControllerController {
    private consultarRutasOptimizadasUseCase = DEPENDENCY_CONTAINER.get<ConsultarDepartamentosUseCase>(
        TYPESDEPENDENCIES.ConsultarRutasOptimizadasUseCase,
    )

    async consultarRutasOptimizadas(_req: Req): Promise<Response<Status | null>> {
        const dataIn = validateData<IEquipoIn>(ConsultarRutasOptimizadasSchema, _req.data)
        const data = await this.consultarRutasOptimizadasUseCase.execute(dataIn)
        return Result.ok<Status>({ ok: 'consultado rutas optimizadas', data })
    }

    async calcularRutaOptima(_req: Req): Promise<Response<Status | null>> {
        const dataIn = validateData<ICalcularRutaOptimaIn>(CalcularRutaOptimaSchema, _req.data)
        const data = await this.consultarRutasOptimizadasUseCase.calcularRutaOptima(dataIn)
        return Result.ok<Status>({ ok: 'ruta optima calculada', data })
    }

    async registrarEventoInesperado(_req: Req): Promise<Response<Status | null>> {
        const dataIn = validateData<IEventoInesperadoIn>(RegistrarEventoInesperadoSchema, _req.data)

        const data = await this.consultarRutasOptimizadasUseCase.registrarEventoInesperado(dataIn)
        return Result.ok<Status>({ ok: 'evento inesperado registrado', data })
    }

    async replanificarRuta(_req: Req): Promise<Response<Status | null>> {
        const dataIn = validateData<IReplanificarRutaIn>(ReplanificarRutaSchema, _req.data)

        const data = await this.consultarRutasOptimizadasUseCase.replanificarRuta(dataIn)
        return Result.ok<Status>({ ok: 'ruta replanificada', data })
    }
}
