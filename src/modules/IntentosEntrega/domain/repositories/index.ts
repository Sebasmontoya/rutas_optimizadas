import { RegistroNovedadRepository } from './RegistroNovedadRepository';
import { NovedadRepository } from './NovedadRepository';
import { ConfiguracionRepository } from './ConfiguracionRepository';
import { StageRegistroNovedadRepository } from './StageRegistroNovedadRepository';

export type IntentoEntregaRepository = RegistroNovedadRepository &
    NovedadRepository &
    ConfiguracionRepository &
    StageRegistroNovedadRepository &
    RegistroNovedadRepository;

export { RegistroNovedadRepository, NovedadRepository, ConfiguracionRepository };
