import 'module-alias/register'
import 'reflect-metadata'
import ModulesFactory from '@common/modules/ModulesFactory'
import TYPESSERVER from '@infrastructure/app/server/TypeServer'
import RutasOptimizadasModule from '@modules/RutasOptimizadas/RutasOptimizadasModule'

async function bootstrap() {
    const modulesFactory = new ModulesFactory()
    const server = modulesFactory.createServer(TYPESSERVER.Fastify)
    modulesFactory.initModules([RutasOptimizadasModule])
    server?.start()
}
bootstrap()
