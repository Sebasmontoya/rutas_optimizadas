import { IStageDetail } from '@modules/IntentosEntrega/usecase/dto/in';

export interface StageRegistroNovedadRepository {
    listaIntentosEntregaHoy(numero_guia: number): Promise<IStageDetail[]>;
}
