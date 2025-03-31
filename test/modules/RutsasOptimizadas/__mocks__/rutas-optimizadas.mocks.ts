import { jest } from '@jest/globals'
import {
    IOptimizacionRutaOut,
    IEnvioOut,
    IEquipoRepartoOut,
    IVehiculoOut,
    ITraficoClimaOut,
    IEventoInesperadoOut,
    OptimizationResponse,
} from '../../../../src/modules/RutasOptimizadas/usecase/dto/out'
import { RutasOptimizadasRepository } from '../../../../src/modules/RutasOptimizadas/domain/repositories/RutasOptimizadasRepository'

export const MOCK_ID_EQUIPO = 'equipo-123'
export const MOCK_ID_EVENTO = 'evento-123'
export const TODAY = new Date()

export const createMockRepository = (): jest.Mocked<RutasOptimizadasRepository> => ({
    obtenerRutaOptimaExistente: jest.fn(),
    obtenerEnvios: jest.fn(),
    obtenerEnviosPendientesPorPrioridad: jest.fn(),
    obtenerEquipoReparto: jest.fn(),
    obtenerVehiculoPorEquipo: jest.fn(),
    obtenerCondicionesTraficoClima: jest.fn(),
    obtenerCondicionTraficoClimaPorUbicacion: jest.fn(),
    obtenerEventosInesperadosPorEquipoYFecha: jest.fn(),
    obtenerEventoInesperado: jest.fn(),
    registrarEventoInesperado: jest.fn(),
    guardarRutaOptimizada: jest.fn(),
    actualizarRutaOptimizada: jest.fn(),
})

export const mockEquipo: IEquipoRepartoOut = {
    id: '1',
    nombre: 'Equipo Test',
    id_equipo: MOCK_ID_EQUIPO,
    ubicacion_actual: {
        type: 'Point',
        coordinates: [10.123, 20.456],
    },
    direccion: 'Dirección Base',
    ciudad: 'Ciudad Test',
    departamento: 'Departamento Test',
    disponibilidad: true,
    created_at: TODAY,
}

export const mockVehiculo: IVehiculoOut = {
    id: '1',
    id_equipo: MOCK_ID_EQUIPO,
    capacidad_carga: 1000,
    created_at: TODAY,
}

export const mockEnviosPendientes: IEnvioOut[] = [
    {
        id: 'envio-1',
        destino: {
            type: 'Point',
            coordinates: [11.123, 21.456],
        },
        direccion_destino: 'Calle Test 123',
        ciudad_destino: 'Ciudad Test',
        departamento_destino: 'Departamento Test',
        peso_carga: 10,
        sla_entrega: '2h',
        estado: 'pendiente',
        prioridad: 1,
    },
    {
        id: 'envio-2',
        destino: {
            type: 'Point',
            coordinates: [12.123, 22.456],
        },
        direccion_destino: 'Calle Test 456',
        ciudad_destino: 'Ciudad Test',
        departamento_destino: 'Departamento Test',
        peso_carga: 15,
        sla_entrega: '3h',
        estado: 'pendiente',
        prioridad: 2,
    },
]

export const mockCondicionesTrafico: ITraficoClimaOut[] = [
    {
        id: '1',
        ubicacion: {
            type: 'Point',
            coordinates: [10.123, 20.456],
        },
        direccion: 'Avenida Principal',
        ciudad: 'Ciudad Test',
        departamento: 'Departamento Test',
        nivel_trafico: 5,
        condiciones_climaticas: 'despejado',
        temperatura: 25,
        humedad: 60,
        created_at: TODAY,
    },
]

export const mockEvento: IEventoInesperadoOut = {
    id: '1',
    id_equipo: MOCK_ID_EQUIPO,
    descripcion: 'Tráfico intenso en avenida principal',
    tipo: 'trafico',
    id_evento: MOCK_ID_EVENTO,
    created_at: TODAY,
}

export const mockRutaOptimizada: IOptimizacionRutaOut = {
    id: '1',
    id_equipo: MOCK_ID_EQUIPO,
    fecha: TODAY,
    ruta_optima: {
        envios: ['envio-1', 'envio-2'],
        duracion_total: 120,
        steps: [
            { type: 'start', location: [10.123, 20.456] },
            { type: 'job', location: [11.123, 21.456], job: 0 },
            { type: 'job', location: [12.123, 22.456], job: 1 },
            { type: 'end', location: [10.123, 20.456] },
        ],
    },
    created_at: TODAY,
}

export const mockOptimizationResponse: OptimizationResponse = {
    code: 200,
    summary: {
        cost: 100,
        routes: 1,
        unassigned: 0,
        delivery: [2],
        amount: [25],
        pickup: [],
        service: 30,
        duration: 120,
        waiting_time: 0,
        priority: 3,
        violations: [],
        computing_times: {
            loading: 0.01,
            solving: 0.5,
            routing: 0.2,
        },
    },
    routes: [
        {
            vehicle: 0,
            cost: 100,
            description: 'Ruta para vehículo 1',
            delivery: [2],
            amount: [25],
            pickup: [],
            service: 30,
            duration: 120,
            distance: 15000,
            waiting_time: 0,
            priority: 3,
            steps: [
                {
                    type: 'start',
                    location: [10.123, 20.456],
                    description: 'Inicio',
                },
                {
                    type: 'job',
                    location: [11.123, 21.456],
                    job: 0,
                    description: 'Entrega 1',
                },
                {
                    type: 'job',
                    location: [12.123, 22.456],
                    job: 1,
                    description: 'Entrega 2',
                },
                {
                    type: 'end',
                    location: [10.123, 20.456],
                    description: 'Regreso',
                },
            ],
            violations: [],
        },
    ],
}

export const mockRutaReplanificada: IOptimizacionRutaOut = {
    id: '2',
    id_equipo: MOCK_ID_EQUIPO,
    fecha: TODAY,
    ruta_optima: {
        envios: ['envio-2', 'envio-1'],
        duracion_total: 150,
        steps: [
            { type: 'start', location: [10.123, 20.456] },
            { type: 'job', location: [12.123, 22.456], job: 1 },
            { type: 'job', location: [11.123, 21.456], job: 0 },
            { type: 'end', location: [10.123, 20.456] },
        ],
    },
    id_evento: MOCK_ID_EVENTO,
    created_at: TODAY,
}
// eslint/no-explicit-any
export const compareWithDates = (actual: unknown, expected: unknown): void => {
    expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected))
}
