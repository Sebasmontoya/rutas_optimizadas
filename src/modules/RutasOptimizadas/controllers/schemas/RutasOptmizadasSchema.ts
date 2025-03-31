import CustomJoi from '@common/util/JoiMessage'
import { IEquipoIn, IEventoInesperadoIn, IReplanificarRutaIn } from '@modules/RutasOptimizadas/usecase/dto/in'

export const ConsultarCiudadesSchema = CustomJoi.object<IEquipoIn>({
    idEquipo: CustomJoi.string().required(),
})

export const ConsultarRutasOptimizadasSchema = CustomJoi.object<IEquipoIn>({
    idEquipo: CustomJoi.string().required(),
})
export const CalcularRutaOptimaSchema = CustomJoi.object<IEquipoIn>({
    idEquipo: CustomJoi.string().required(),
})
export const RegistrarEventoInesperadoSchema = CustomJoi.object<IEventoInesperadoIn>({
    idEquipo: CustomJoi.string().required(),
    descripcion: CustomJoi.string().required(),
    tipo: CustomJoi.string().valid('trafico', 'clima', 'vehiculo').required(),
    id_evento: CustomJoi.string().optional(),
})
export const ReplanificarRutaSchema = CustomJoi.object<IReplanificarRutaIn>({
    idEquipo: CustomJoi.string().required(),
    idEvento: CustomJoi.string().required(),
})
