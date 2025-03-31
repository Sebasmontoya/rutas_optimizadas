import { injectable } from 'inversify'
import { IEventoInesperadoIn } from '@modules/RutasOptimizadas/usecase/dto/in'
import { IEventoInesperadoOut } from '@modules/RutasOptimizadas/usecase/dto/out'
import RutaOptimizadaException from '@common/http/exceptions/RutaOptimizadaException'
import { PubSub } from '@google-cloud/pubsub'
import ENV from '@common/envs/Envs'
import BaseRutaUseCase from './BaseRutaUseCase'

@injectable()
export default class RegistrarEventoInesperadoUseCase extends BaseRutaUseCase {
    private readonly pubSubService: PubSub

    constructor(pubSubService: PubSub) {
        super()
        this.pubSubService = pubSubService
    }

    async execute(data: IEventoInesperadoIn): Promise<IEventoInesperadoOut> {
        try {
            this.info('EVENTOS', 'execute', [`Registrando evento inesperado tipo: ${data.tipo}`])

            const equipo = await this.rutasOptimizadasRepository.obtenerEquipoReparto(data.idEquipo)

            if (!equipo) {
                throw new RutaOptimizadaException(404, `Equipo de reparto con ID ${data.idEquipo} no encontrado`)
            }

            const evento = await this.rutasOptimizadasRepository.registrarEventoInesperado({
                id_equipo: data.idEquipo,
                descripcion: data.descripcion,
                tipo: data.tipo,
                id_evento: data.id_evento,
            })

            this.info('EVENTOS', 'execute', [`Evento inesperado registrado con ID: ${evento.id}`])

            await this.publicarEventoReplanificacion(evento)

            return evento
        } catch (error) {
            this.error('EVENTOS', 'execute', [`Error registrando evento inesperado: ${error.message}`])

            if (error instanceof RutaOptimizadaException) {
                throw error
            }

            throw new RutaOptimizadaException(500, `Error al registrar evento inesperado: ${error.message}`)
        }
    }

    private async publicarEventoReplanificacion(evento: IEventoInesperadoOut): Promise<void> {
        try {
            const mensaje = {
                eventoId: evento.id,
                equipoId: evento.id_equipo,
            }

            this.info('EVENTOS', 'publicarEventoReplanificacion', [`Publicando evento en topic: ${ENV.TOPIC_PUBSUB}`])
            const topic = this.pubSubService.topic(ENV.TOPIC_PUBSUB)
            await topic.publishMessage({ json: mensaje })
            this.info('EVENTOS', 'publicarEventoReplanificacion', [`Evento publicado correctamente`])
        } catch (error) {
            this.error('EVENTOS', 'publicarEventoReplanificacion', [`Error al publicar en PubSub: ${error.message}`])
        }
    }
}
