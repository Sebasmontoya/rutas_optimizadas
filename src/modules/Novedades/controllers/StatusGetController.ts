import { Response } from '@common/http/Response';
import { Result } from '@common/http/Result';
import { Controller, Req, Status } from '@modules/shared/infrastructure';
import { injectable } from 'inversify';

@injectable()
export default class StatusGetController implements Controller {
    async run(req: Req): Promise<Response<Status | null>> {
        return Result.ok<Status>({ ok: 'cualquier coaaasa', otra_cosa: req });
    }
}
