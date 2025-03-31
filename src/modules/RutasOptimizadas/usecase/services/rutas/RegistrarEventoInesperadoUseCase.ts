import { injectable } from 'inversify'
import { IEventoInesperadoIn } from '@modules/RutasOptimizadas/usecase/dto/in'
import { IEventoInesperadoOut } from '@modules/RutasOptimizadas/usecase/dto/out'
import RutaOptimizadaException from '@common/http/exceptions/RutaOptimizadaException'
import BaseRutaUseCase from './BaseRutaUseCase'

@injectable()
export default class RegistrarEventoInesperadoUseCase extends BaseRutaUseCase {
    async execute(data: IEventoInesperadoIn): Promise<IEventoInesperadoOut> {
        try {
            this.info('EVENTOS', 'execute', [`Registrando evento inesperado tipo: ${data.tipo}`])

            // Verificar que el equipo existe
            const equipo = await this.rutasOptimizadasRepository.obtenerEquipoReparto(data.idEquipo)

            if (!equipo) {
                throw new RutaOptimizadaException(404, `Equipo de reparto con ID ${data.idEquipo} no encontrado`)
            }

            // Registrar evento
            const evento = await this.rutasOptimizadasRepository.registrarEventoInesperado({
                id_equipo: data.idEquipo,
                descripcion: data.descripcion,
                tipo: data.tipo,
                id_evento: data.id_evento,
            })

            this.info('EVENTOS', 'execute', [`Evento inesperado registrado con ID: ${evento.id}`])
            return evento
        } catch (error) {
            this.error('EVENTOS', 'execute', [`Error registrando evento inesperado: ${error.message}`])

            if (error instanceof RutaOptimizadaException) {
                throw error
            }

            throw new RutaOptimizadaException(500, `Error al registrar evento inesperado: ${error.message}`)
        }
    }
}
