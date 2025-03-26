import 'module-alias/register';
import 'reflect-metadata';
import { TYPESSERVER } from '@infrastructure/app/server/TypeServer';
import { NovedadesModules } from '@modules/Novedades/NovedadesModule';
import { IntentosEntregaModules } from '@modules/IntentosEntrega/IntentosEntregaModule';
import ModulesFactory from '@common/modules/ModulesFactory';
import { logger } from '@common/logger/Logger';

async function bootstrap() {
    const modulesFactory = new ModulesFactory();
    const server = modulesFactory.createServer(TYPESSERVER.Fastify);
    modulesFactory.initModules([NovedadesModules, IntentosEntregaModules]);
    server?.start();
}
bootstrap();
