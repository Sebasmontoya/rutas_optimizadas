import { Response } from '@common/http/Response';
import { Result } from '@common/http/Result';
import { IUseCase } from '@common/modules/IUseCase';
import { injectable } from 'inversify';
import { IRegistroIntentoEntrega } from '../dto/in/IIntentoEntrega';
import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer';
import { BadMessageException } from '@common/http/exceptions';
import { TYPESDEPENDENCIES } from '@modules/IntentosEntrega/dependencies/TypesDependencies';
import { IntentoEntregaRepository } from '@modules/IntentosEntrega/domain/repositories';
import { FuenteRegistro } from '@common/enum/FuenteRegistro';
import { IStageDetail } from '../dto/in';
import { Novedad } from '@modules/IntentosEntrega/domain/entities/Novedad';

type GenericObject = { [x: string]: number };
type GenericArray = [string, number];
@injectable()
export class RegistrarIntentosEntregaUseCase implements IUseCase {
    private registroEntregaRepository = DEPENDENCY_CONTAINER.get<IntentoEntregaRepository>(
        TYPESDEPENDENCIES.RegistroIntentoEntregaRepository,
    );

    private handleReduceMap(acumulador: GenericObject, data: IStageDetail): GenericObject {
        const contador = acumulador[data.codigo_novedad];
        return {
            ...acumulador,
            [data.codigo_novedad]: !contador ? 1 : contador + 1,
        };
    }
    private handleReduce(listNovedades: Novedad[]) {
        return (acumulador: number, [codigo_novedad, counter]: GenericArray) => {
            const novedad = listNovedades.find((novedad) => novedad.id === parseInt(codigo_novedad));
            if (novedad?.intento_entrega) {
                return acumulador + counter;
            }
            return acumulador;
        };
    }

    async execute({ numero_guia, codigo_novedad, ...data }: IRegistroIntentoEntrega): Promise<Response<null>> {
        const newIntentoEntrega = data.intento_entrega + 1;
        if (data.fuente_registro !== FuenteRegistro.GOO_ENTREGAS) {
            throw new BadMessageException('', 'Fuente de entrega invalida');
        }

        const existeNovedad = await this.registroEntregaRepository.existeNovedadPorIdYPermiteIntentoEngrega(
            codigo_novedad,
        );
        const configuracionGuia = await this.registroEntregaRepository.obtenerPorIdNovedad(codigo_novedad);

        if (!existeNovedad || !configuracionGuia) {
            throw new BadMessageException('', 'Novedad o configuracion inexistente');
        }
        const existeUnUnicoIntentoEntregaHoy = !false;
        if (existeUnUnicoIntentoEntregaHoy) {
            await this.registroEntregaRepository.actualizarIntentoEntrega(numero_guia, newIntentoEntrega);
        }

        if (
            existeUnUnicoIntentoEntregaHoy &&
            newIntentoEntrega > configuracionGuia.numero_intentos &&
            !data.estado_reporte
        ) {
            await this.registroEntregaRepository.actualizarEstadoReporte(numero_guia, true);
        }
        return Result.ok<null>();
    }
}
