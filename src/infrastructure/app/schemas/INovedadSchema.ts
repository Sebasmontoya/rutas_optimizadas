import Joi from 'joi';
import { Novedad } from '../../../modules/Novedades/domain/entities/Novedad';

export const INovedadSchema = Joi.object<Novedad>({
    numero_guia: Joi.string().required().max(11),
    id_novedad: Joi.number().required(),
    fecha_hora_registro_novedad: Joi.date().iso().required(),
    empleado_registra: Joi.number()
        .integer()
        .custom((value, helpers) => {
            const stringValue = value.toString();
            if (stringValue.length <= 7) {
                return value;
            }
            return helpers.error('El empleado son maximo 7 digitos', { limit: 7 });
        })
        .required(),
    fuente_registro: Joi.string().required(),
    observaciones_novedad: Joi.string().required().max(500),
    // codigo_terminal_registro: Joi.number()
    //     .integer()
    //     .custom((value, helpers) => {
    //         const stringValue = value.toString();
    //         if (stringValue.length <= 3) {
    //             return value;
    //         }
    //         return helpers.error('Terminal son maximo 3 digitos', { limit: 3 });
    //     })
    //     .required(),
});
