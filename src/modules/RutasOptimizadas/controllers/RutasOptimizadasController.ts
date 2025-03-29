import { Req } from '@modules/shared/infrastructure'
import { injectable } from 'inversify'
import { Response } from '@common/http/Response'

import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer'
import Result from '@common/http/Result'
import { validateData } from '@common/util/Schemas'
import { Status } from '../../shared/infrastructure/Controller'
import TYPESDEPENDENCIES from '../dependencies/TypesDependencies'
import { IEquipoIn } from '../usecase/dto/in'
import ConsultarDepartamentosUseCase from '../usecase/services/ConsultarRutasOptimasUseCase'
import { ConsultarRutasOptimizadasSchema } from './schemas/RutasOptmizadasSchema'

@injectable()
export default class RutasOptimizadasControllerController {
    private consultarRutasOptimizadasUseCase = DEPENDENCY_CONTAINER.get<ConsultarDepartamentosUseCase>(
        TYPESDEPENDENCIES.ConsultarRutasOptimizadasUseCase,
    )

    async consultarRutasOptimizadas(_req: Req): Promise<Response<Status | null>> {
        const dataIn = validateData<IEquipoIn>(ConsultarRutasOptimizadasSchema, _req.data)
        const data = await this.consultarRutasOptimizadasUseCase.execute(dataIn)
        return Result.ok<Status>({ ok: 'Se Ruta Optima para el equipo', data })
    }
}
