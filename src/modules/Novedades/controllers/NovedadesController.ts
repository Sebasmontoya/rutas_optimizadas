import { Controller, Req } from '@modules/shared/infrastructure';
import { injectable } from 'inversify';
import { Response } from '@common/http/Response';
import { Result } from '@common/http/Result';
import { Status } from '../../shared/infrastructure/Controller';
import { logger } from '@common/logger';

@injectable()
export class NovedadesController implements Controller {
    async run(_req: Req): Promise<Response<Status | null>> {
        logger.info('Novedades', '17625371652412', { error: 'Se perdio la guia' });
        logger.error('Novedades', '17625371652412', 'uy un error');
        return Result.failure<Status>({
            ok: 'Registro Fallido',
            Error: 'No se pudo realizar el proceso, intente nuevamente',
        });
    }
}

@injectable()
export class NovedadesController2 implements Controller {
    async run(_req: Req): Promise<Response<Status | null>> {
        logger.info('Novedades 2', '777777777777', { error: 'Esta no se perdio' });
        return Result.failure<Status>({
            ok: 'Registro Fallido',
            Error: 'No se pudo realizar el proceso, intente nuevamente',
        });
    }
}
