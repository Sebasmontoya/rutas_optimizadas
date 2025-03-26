import Joi from 'joi';
import { IRegistroIntentoEntrega } from '@modules/IntentosEntrega/usecase/dto/in/IIntentoEntrega';
export const IRegistraIntentosEntregaSchema = Joi.object<IRegistroIntentoEntrega>({
    numero_guia: Joi.number().required(),
    codigo_novedad: Joi.number().required(),
    intento_entrega: Joi.number().required(),
    fuente_registro: Joi.string().required(),
    estado_reporte: Joi.boolean().required(),
});
