import { IModule } from '@common/modules/IModule';
import { createDependencies } from './dependencies/Dependencies';
import { NovedadesController, NovedadesController2 } from './controllers/NovedadesController';
import { HTTPMETODO, Ruta } from '@common/modules/Ruta';
import { logger } from '@common/logger/Logger';

export class NovedadesModules implements IModule {
    private moduloRuta = '/';

    constructor() {
        createDependencies();
    }

    getRutas = (): Ruta[] => {
        return [
            { metodo: HTTPMETODO.POST, url: '/novedades', evento: NovedadesController.prototype.run },
            {
                metodo: HTTPMETODO.GET,
                url: '/cualquiercosa',
                evento: NovedadesController.prototype.run,
            },
            {
                metodo: HTTPMETODO.GET,
                url: '/cualquierotracosa',
                evento: NovedadesController2.prototype.run,
            },
        ];
    };

    get ruta(): string {
        return this.moduloRuta;
    }
}
