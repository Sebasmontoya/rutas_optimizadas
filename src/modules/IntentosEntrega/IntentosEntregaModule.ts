import { IModule } from '@common/modules/IModule';
import { createDependencies } from './dependencies/Dependencies';
import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer';
import { Controller } from '@modules/shared/infrastructure';
import { TYPESDEPENDENCIES } from './dependencies/TypesDependencies';
import { HTTPMETODO, Ruta } from '@common/modules/Ruta';

export class IntentosEntregaModules implements IModule {
    private moduloRuta = '/';

    constructor() {
        createDependencies();
    }

    getRutas = (): Ruta[] => {
        const intentoEntregaCotroller = DEPENDENCY_CONTAINER.get<Controller>(
            TYPESDEPENDENCIES.IntentosEntregaController,
        );
        return [
            {
                metodo: HTTPMETODO.POST,
                url: '/intentosEntrega',
                evento: intentoEntregaCotroller.run.bind(intentoEntregaCotroller),
            },
        ];
    };

    get ruta(): string {
        return this.moduloRuta;
    }
}
