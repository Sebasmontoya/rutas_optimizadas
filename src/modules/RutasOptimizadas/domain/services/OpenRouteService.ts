import axios from 'axios'
import { logger } from '@common/logger'
import { IEnvioOut, OptimizationResponse, IOptimizacionRutaOut } from '@modules/RutasOptimizadas/usecase/dto/out'
import RutaOptimizadaException from '@common/http/exceptions/RutaOptimizadaException'
import ENV from '@common/envs/Envs'
import GeoTimeUtils from '../util/GeoTimeUtils'
import { OptimizationParams, RouteStep, StepTraducido } from '../types/IOpenRouteService'

export default class OpenRouteService {
    static buildOptimizationPayload(params: OptimizationParams) {
        const { vehiculo, equipo, envios, condicionesTrafico, eventoInesperado } = params

        const ubicacionEquipo = equipo.ubicacion_actual.coordinates

        const jobs = envios.map((envio, index) => {
            const ubicacionEnvio = envio.destino.coordinates

            const serviceDuration = GeoTimeUtils.calcularDuracionServicio(
                envio.ciudad_destino,
                envio.departamento_destino,
                condicionesTrafico,
            )

            const slaSeconds = GeoTimeUtils.convertTimeToSeconds(envio.sla_entrega)

            let priority
            if (typeof envio.prioridad === 'boolean') {
                priority = envio.prioridad ? 2 : 5
            } else if (envio.prioridad !== null && envio.prioridad !== undefined) {
                priority = Math.min(10, Math.max(1, 10 - parseInt(envio.prioridad.toString(), 10)))
            } else {
                priority = 5
            }

            const startTime = 28800
            let endTime

            if (slaSeconds && slaSeconds > startTime) {
                endTime = slaSeconds
            } else {
                endTime = 64800
            }

            return {
                id: index + 1,
                description: `Envío ${envio.id} - ${envio.direccion_destino}`,
                location: ubicacionEnvio,
                service: serviceDuration,
                amount: [parseInt(envio.peso_carga.toString(), 10)],
                skills: [1],
                priority,
                time_windows: [[startTime, endTime]],
            }
        })

        const vehicles = [
            {
                id: 1,
                profile: 'driving-car',
                description: `Vehículo ${vehiculo.id} - Equipo ${equipo.id_equipo}`,
                start: ubicacionEquipo,
                end: ubicacionEquipo,
                capacity: [parseInt(vehiculo.capacidad_carga.toString(), 10)],
                skills: [1],
                time_window: [28800, 64800],
                breaks: [
                    {
                        id: 1,
                        description: 'Almuerzo',
                        service: 2700,
                        time_windows: [[43200, 46800]],
                    },
                ],
                speed_factor: 1,
            },
        ]

        if (eventoInesperado) {
            if (eventoInesperado.tipo === 'clima') {
                vehicles[0].speed_factor = 0.8
            } else if (eventoInesperado.tipo === 'vehiculo') {
                vehicles[0].capacity = [Math.floor(vehicles[0].capacity[0] * 0.7)]
            }
        }

        const gFactor = GeoTimeUtils.calculateGFactor(condicionesTrafico, eventoInesperado)

        return {
            jobs,
            vehicles,
            options: {
                g_factor: gFactor,
                max_jobs_per_vehicle: null,
                objectives: ['min-schedule-completion-time', 'min-distance'],
                balance_objectives: [0.7, 0.3],
            },
        }
    }

    static async calcularRutaOptima(params: OptimizationParams): Promise<OptimizationResponse> {
        try {
            const payload = this.buildOptimizationPayload(params)
            logger.info('OPEN_ROUTE_SERVICE', 'calcularRutaOptima', ['Enviando petición a OpenRouteService'])

            const response = await axios.post(ENV.URL_OPEN_ROUTE_SERVICE, payload, {
                headers: {
                    Authorization: `Bearer ${ENV.OPEN_ROUTE_SERVICE_API_KEY}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
            logger.info('OPEN_ROUTE_SERVICE', 'calcularRutaOptima', ['Respuesta recibida de OpenRouteService'])
            return response.data
        } catch (error) {
            logger.error('OPEN_ROUTE_SERVICE', 'calcularRutaOptima', [
                `Error en API de OpenRouteService: ${error.message}`,
            ])
            throw new RutaOptimizadaException(
                error.response?.status || 500,
                `Error en API de OpenRouteService: ${error.response?.data?.error || error.message}`,
            )
        }
    }

    static procesarRespuestaOptimizacion(
        response: OptimizationResponse,
        idEquipo: string,
        envios: IEnvioOut[],
        idEvento?: string,
    ): IOptimizacionRutaOut {
        if (!response.routes || response.routes.length === 0) {
            throw new RutaOptimizadaException(500, 'La API de optimización no devolvió rutas')
        }

        const rutaEnvios = response.routes.flatMap((route) =>
            route.steps
                .filter((step) => step.type === 'job' && step.job)
                .map((step) => {
                    const jobIndex = (step.job ?? 0) - 1
                    return envios[jobIndex]?.id
                })
                .filter((id) => id),
        )

        const duracionTotal = response.routes.reduce((sum, route) => sum + route.duration, 0)

        const stepsTraducidos = response.routes.flatMap((route) =>
            route.steps.map((step) => {
                const stepEspanol: StepTraducido = {
                    tipo: step.type,
                    ubicacion: step.location,
                    llegada: step.arrival,
                    duracion: step.duration,
                    carga: step.load,
                    tiempoEspera: step.waiting_time || 0,
                    violaciones: step.violations || [],
                }

                if (step.type === 'job') {
                    stepEspanol.id = step.id
                    stepEspanol.trabajo = step.job
                    stepEspanol.descripcion = step.description
                    stepEspanol.servicio = step.service || 0
                } else if (step.type === 'break') {
                    stepEspanol.id = step.id
                    stepEspanol.descripcion = step.description
                    stepEspanol.servicio = step.service || 0
                }

                return stepEspanol
            }),
        )

        return {
            id_equipo: idEquipo,
            fecha: new Date(),
            ruta_optima: {
                envios: rutaEnvios,
                duracion_total: duracionTotal,
                steps: stepsTraducidos as unknown as RouteStep[],
            },
            id_evento: idEvento,
        }
    }
}
