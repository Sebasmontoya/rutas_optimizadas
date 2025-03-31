import { DEPENDENCY_CONTAINER } from '@common/dependencies/DependencyContainer'
import { RutasOptimizadasRepository } from '@modules/RutasOptimizadas/domain/repositories/RutasOptimizadasRepository'
import TYPESDEPENDENCIES from '@modules/RutasOptimizadas/dependencies/TypesDependencies'
import { logger } from '@common/logger'
import RutaOptimizadaException from '@common/http/exceptions/RutaOptimizadaException'
import {
    IEnvioOut,
    IEquipoRepartoOut,
    IEventoInesperadoOut,
    IVehiculoOut,
} from '@modules/RutasOptimizadas/usecase/dto/out'

export default abstract class BaseRutaUseCase {
    protected rutasOptimizadasRepository = DEPENDENCY_CONTAINER.get<RutasOptimizadasRepository>(
        TYPESDEPENDENCIES.PostgresRutasOptimizadasRepository,
    )

    protected validarDatos(
        idEquipo: string,
        equipo: IEquipoRepartoOut,
        vehiculo: IVehiculoOut,
        enviosPendientes: IEnvioOut[],
    ) {
        if (!equipo) {
            throw new RutaOptimizadaException(404, `Equipo de reparto con ID ${idEquipo} no encontrado`)
        }

        if (!vehiculo) {
            throw new RutaOptimizadaException(404, `No se encontró vehículo asignado al equipo ${idEquipo}`)
        }

        if (enviosPendientes.length === 0) {
            throw new RutaOptimizadaException(404, 'No hay envíos pendientes para optimizar')
        }

        if (!equipo.disponibilidad) {
            throw new RutaOptimizadaException(400, `El equipo ${idEquipo} no está disponible actualmente`)
        }
    }

    /**
     * Valida un evento para replanificación
     */
    protected validarEvento(evento: IEventoInesperadoOut, idEquipo: string) {
        const eventDate = new Date(evento.created_at ?? '')
        const today = new Date()

        if (eventDate.toDateString() !== today.toDateString()) {
            throw new RutaOptimizadaException(400, 'Solo se puede replanificar por eventos ocurridos hoy')
        }

        if (evento.id_equipo !== idEquipo) {
            throw new RutaOptimizadaException(400, 'El evento no corresponde al equipo especificado')
        }
    }

    protected info(contexto: string, metodo: string, mensajes: string[]) {
        logger.info(contexto, metodo, mensajes)
    }

    /**
     * Log de error
     */
    protected error(contexto: string, metodo: string, mensajes: string[]) {
        logger.error(contexto, metodo, mensajes)
    }
}
