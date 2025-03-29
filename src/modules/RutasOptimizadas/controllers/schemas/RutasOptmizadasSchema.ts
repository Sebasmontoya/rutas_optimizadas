import CustomJoi from '@common/util/JoiMessage'
import { IEquipoIn } from '@modules/RutasOptimizadas/usecase/dto/in'

export const ConsultarCiudadesSchema = CustomJoi.object<IEquipoIn>({
    idEquipo: CustomJoi.number().required(),
})

export const ConsultarRutasOptimizadasSchema = CustomJoi.object<IEquipoIn>({
    idEquipo: CustomJoi.number().required(),
})
