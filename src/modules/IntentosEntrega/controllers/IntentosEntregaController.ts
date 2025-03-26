import { Controller } from '@modules/shared/infrastructure';
import { injectable } from 'inversify';
import { Response } from '@common/http/Response';
import { Result } from '@common/http/Result';
import { Req, Status } from '../../shared/infrastructure/Controller';
import { validateDataPubSub } from '@common/util/Schemas';
import { IRegistraIntentosEntregaSchema } from '@infrastructure/app/schemas/IRegistraIntentosEntrega';
import { IRegistroIntentoEntrega } from '../usecase/dto/in/IIntentoEntrega';
import { TYPESDEPENDENCIES } from '../dependencies/TypesDependencies';
import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer';
import { RegistrarIntentosEntregaUseCase } from '../usecase/services';

@injectable()
export class IntentoSEntregaController implements Controller {
    private novedadUseCase = DEPENDENCY_CONTAINER.get<RegistrarIntentosEntregaUseCase>(
        TYPESDEPENDENCIES.RegistrarIntentosEntregaUseCase,
    );
    async run(_req: Req): Promise<Response<Status | null>> {
        const data = validateDataPubSub<IRegistroIntentoEntrega>(IRegistraIntentosEntregaSchema, _req.data);
        await this.novedadUseCase.execute(data);
        return Result.ok<Status>({ ok: 'Proceso hecho con exito' });
    }
}
