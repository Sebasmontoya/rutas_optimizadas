import { IModule } from '@common/modules/IModule'
import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer'
import { HTTPMETODO, Ruta } from '@common/modules/Ruta'
import TYPES from './dependencies/TypesDependencies'
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
            TYPES.RutasOptimizadasControllerController,
        )

        return [
            {
                metodo: HTTPMETODO.GET,
                url: '/ruta_optima/:idEquipo',
                evento: rutasOptimizadasController.consultarRutasOptimizadas.bind(rutasOptimizadasController),
                schema: RutasOptmizadasSchemaSchema.consultarRutasOptimizadas,
                //  preHandler: verificarToken
            },
            {
                metodo: HTTPMETODO.POST,
                url: '/ruta_optima/calcular',
                evento: rutasOptimizadasController.calcularRutaOptima.bind(rutasOptimizadasController),
                schema: RutasOptmizadasSchemaSchema.calcularRutaOptima,
                //  preHandler: verificarToken
            },
            {
                metodo: HTTPMETODO.POST,
                url: '/ruta_optima/evento_inesperado',
                evento: rutasOptimizadasController.registrarEventoInesperado.bind(rutasOptimizadasController),
                schema: RutasOptmizadasSchemaSchema.registrarEventoInesperado,
                // preHandler: verificarToken
            },
            {
                metodo: HTTPMETODO.POST,
                url: '/ruta_optima/replanificar',
                evento: rutasOptimizadasController.replanificarRuta.bind(rutasOptimizadasController),
                schema: RutasOptmizadasSchemaSchema.replanificarRuta,
                //  preHandler: verificarToken
            },
        ]
    }

    get ruta(): string {
        return this.moduloRuta
    }
}
