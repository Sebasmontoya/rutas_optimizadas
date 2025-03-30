import { IModule } from '@common/modules/IModule'
import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer'
import { HTTPMETODO, Ruta } from '@common/modules/Ruta'
import TYPESDEPENDENCIES from './dependencies/TypesDependencies'
import createDependencies from './dependencies/Dependencies'
import RutasOptimizadasController from './controllers/RutasOptimizadasController'
import RutasOptmizadasSchemaSchema from './schemas/RutasOptimizadasSchema'

export default class RutasOptimizadasModule implements IModule {
    private moduloRuta = '/'

    constructor() {
        createDependencies()
    }

    getRutas = (): Ruta[] => {
        const rutasOptimizadasController = DEPENDENCY_CONTAINER.get<RutasOptimizadasController>(
            TYPESDEPENDENCIES.RutasOptimizadasControllerController,
        )
        return [
            {
                metodo: HTTPMETODO.GET,
                url: '/ruta_optima/:idEquipo',
                evento: rutasOptimizadasController.consultarRutasOptimizadas.bind(rutasOptimizadasController),
                schema: RutasOptmizadasSchemaSchema.consultarDepartamentos,
            },
        ]
    }

    get ruta(): string {
        return this.moduloRuta
    }
}
