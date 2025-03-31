import { ITraficoClimaOut, IEventoInesperadoOut } from '@modules/RutasOptimizadas/usecase/dto/out'

export default class GeoTimeUtils {
    static convertTimeToSeconds(timeInput: string | Date): number {
        if (timeInput instanceof Date || (typeof timeInput === 'object' && timeInput !== null)) {
            const date = new Date(timeInput)
            const hours = date.getHours()
            const minutes = date.getMinutes()
            return hours * 3600 + minutes * 60
        }
        if (typeof timeInput === 'string' && timeInput.includes('T')) {
            const date = new Date(timeInput)
            const hours = date.getHours()
            const minutes = date.getMinutes()
            return hours * 3600 + minutes * 60
        }

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
        const avgTrafficLevel =
            condicionesTrafico.reduce((sum, condition) => sum + condition.nivel_trafico, 0) / condicionesTrafico.length

        const badWeatherCount = condicionesTrafico.filter((c) =>
            ['lluvia', 'tormenta', 'nieve'].includes(c.condiciones_climaticas),
        ).length

        const weatherFactor = 1 + (badWeatherCount / condicionesTrafico.length) * 0.3
        const trafficFactor = 1 + (avgTrafficLevel / 10) * 0.5
        const eventFactor = eventoInesperado?.tipo === 'trafico' ? 1.3 : 1.0
        return weatherFactor * trafficFactor * eventFactor
    }

    static calcularDuracionServicio(
        ciudad: string,
        departamento: string,
        condicionesTrafico: ITraficoClimaOut[],
    ): number {
        let duracion = 300
        const condicionLocal = condicionesTrafico.find((c) => c.ciudad === ciudad && c.departamento === departamento)
        if (condicionLocal) {
            if (condicionLocal.nivel_trafico > 7) {
                duracion += 300
            } else if (condicionLocal.nivel_trafico > 4) {
                duracion += 150
            }
            if (condicionLocal.condiciones_climaticas === 'lluvia') {
                duracion += 180
            } else if (condicionLocal.condiciones_climaticas === 'tormenta') {
                duracion += 360
            }
        }

        return duracion
    }
}
