import { ITraficoClimaOut, IEventoInesperadoOut } from '@modules/RutasOptimizadas/usecase/dto/out'

export default class GeoTimeUtils {
    /**
     * Convierte hora en formato "HH:MM" a segundos desde el inicio del día
     */
    static convertTimeToSeconds(timeInput: string | Date): number {
        // Si es un objeto Date, extraer las horas y minutos
        if (timeInput instanceof Date || (typeof timeInput === 'object' && timeInput !== null)) {
            const date = new Date(timeInput)
            const hours = date.getHours()
            const minutes = date.getMinutes()
            return hours * 3600 + minutes * 60
        }

        // Si es un string en formato ISO (como '2025-03-29T22:50:13.875Z')
        if (typeof timeInput === 'string' && timeInput.includes('T')) {
            const date = new Date(timeInput)
            const hours = date.getHours()
            const minutes = date.getMinutes()
            return hours * 3600 + minutes * 60
        }

        // Formato HH:MM original
        if (typeof timeInput === 'string' && timeInput.includes(':')) {
            const [hours, minutes] = timeInput.split(':').map(Number)
            return hours * 3600 + minutes * 60
        }

        return 64800
    }

    static calculateGFactor(condicionesTrafico: ITraficoClimaOut[], eventoInesperado?: IEventoInesperadoOut): number {
        if (condicionesTrafico.length === 0) {
            return eventoInesperado?.tipo === 'trafico' ? 1.5 : 1.0
        }

        // Calcular promedio de nivel de tráfico
        const avgTrafficLevel =
            condicionesTrafico.reduce((sum, condition) => sum + condition.nivel_trafico, 0) / condicionesTrafico.length

        // Contar condiciones climáticas adversas
        const badWeatherCount = condicionesTrafico.filter((c) =>
            ['lluvia', 'tormenta', 'nieve'].includes(c.condiciones_climaticas),
        ).length

        const weatherFactor = 1 + (badWeatherCount / condicionesTrafico.length) * 0.3
        const trafficFactor = 1 + (avgTrafficLevel / 10) * 0.5

        // Si hay evento de tráfico, aumentar el factor
        const eventFactor = eventoInesperado?.tipo === 'trafico' ? 1.3 : 1.0

        // Combinar factores
        return weatherFactor * trafficFactor * eventFactor
    }

    /**
     * Calcula la duración del servicio basado en condiciones de tráfico y clima
     */
    static calcularDuracionServicio(
        ciudad: string,
        departamento: string,
        condicionesTrafico: ITraficoClimaOut[],
    ): number {
        // Base: 5 minutos (300 segundos)
        let duracion = 300

        // Buscar condiciones para la ubicación
        const condicionLocal = condicionesTrafico.find((c) => c.ciudad === ciudad && c.departamento === departamento)

        if (condicionLocal) {
            // Ajustar por nivel de tráfico
            if (condicionLocal.nivel_trafico > 7) {
                duracion += 300 // +5 min en tráfico pesado
            } else if (condicionLocal.nivel_trafico > 4) {
                duracion += 150 // +2.5 min en tráfico moderado
            }

            // Ajustar por clima
            if (condicionLocal.condiciones_climaticas === 'lluvia') {
                duracion += 180 // +3 min en lluvia
            } else if (condicionLocal.condiciones_climaticas === 'tormenta') {
                duracion += 360 // +6 min en tormenta
            }
        }

        return duracion
    }
}
