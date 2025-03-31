import { jest, describe, beforeEach, it, expect } from '@jest/globals'
import ConsultarRutasOptimizadasUseCase from '../../../src/modules/RutasOptimizadas/usecase/services/ConsultarRutasOptimasUseCase'
import { DEPENDENCY_CONTAINER } from '../../../src/common/dependencies/DependencyContainer'
import TYPESDEPENDENCIES from '../../../src/modules/RutasOptimizadas/dependencies/TypesDependencies'
import OpenRouteService from '../../../src/modules/RutasOptimizadas/domain/services/OpenRouteService'
import RutaOptimizadaException from '../../../src/common/http/exceptions/RutaOptimizadaException'
import { RutasOptimizadasRepository } from '../../../src/modules/RutasOptimizadas/domain/repositories/RutasOptimizadasRepository'
import { 
  MOCK_ID_EQUIPO,
  MOCK_ID_EVENTO,
  TODAY,
  mockEquipo,
  mockVehiculo,
  mockEnviosPendientes,
  mockCondicionesTrafico,
  mockRutaOptimizada,
  mockRutaReplanificada,
  mockEvento,
  mockOptimizationResponse,
  createMockRepository,
  compareWithDates
} from './__mocks__/rutas-optimizadas.mocks'

jest.mock('../../../src/common/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('../../../src/modules/RutasOptimizadas/domain/services/OpenRouteService', () => ({
  calcularRutaOptima: jest.fn(),
  procesarRespuestaOptimizacion: jest.fn(),
}))

describe('ConsultarRutasOptimizadasUseCase - replanificarRuta', () => {
  let consultarRutasOptimizadasUseCase: ConsultarRutasOptimizadasUseCase
  let mockRutasOptimizadasRepository: jest.Mocked<RutasOptimizadasRepository>

  beforeEach(() => {
    jest.clearAllMocks()
    mockRutasOptimizadasRepository = createMockRepository()

    jest.spyOn(DEPENDENCY_CONTAINER, 'get').mockImplementation((type) => {
      if (type === TYPESDEPENDENCIES.PostgresRutasOptimizadasRepository) {
        return mockRutasOptimizadasRepository
      }
      return null
    })

    consultarRutasOptimizadasUseCase = new ConsultarRutasOptimizadasUseCase()
  })

  it('debería replanificar una ruta correctamente debido a un evento inesperado', async () => {
    mockRutasOptimizadasRepository.obtenerEventoInesperado.mockResolvedValue(mockEvento)
    mockRutasOptimizadasRepository.obtenerRutaOptimaExistente.mockResolvedValue(mockRutaOptimizada)
    mockRutasOptimizadasRepository.obtenerEquipoReparto.mockResolvedValue(mockEquipo)
    mockRutasOptimizadasRepository.obtenerVehiculoPorEquipo.mockResolvedValue(mockVehiculo)
    mockRutasOptimizadasRepository.obtenerEnviosPendientesPorPrioridad.mockResolvedValue(mockEnviosPendientes)
    mockRutasOptimizadasRepository.obtenerCondicionesTraficoClima.mockResolvedValue(mockCondicionesTrafico)
    
    jest.spyOn(OpenRouteService, 'calcularRutaOptima').mockResolvedValue(mockOptimizationResponse)
    jest.spyOn(OpenRouteService, 'procesarRespuestaOptimizacion').mockReturnValue({
      id_equipo: MOCK_ID_EQUIPO,
      fecha: TODAY,
      ruta_optima: mockRutaReplanificada.ruta_optima,
      id_evento: MOCK_ID_EVENTO,
    })
    
    mockRutasOptimizadasRepository.guardarRutaOptimizada.mockResolvedValue(mockRutaReplanificada)
    
    const result = await consultarRutasOptimizadasUseCase.replanificarRuta({
      idEquipo: MOCK_ID_EQUIPO,
      idEvento: MOCK_ID_EVENTO,
    })
    
    expect(mockRutasOptimizadasRepository.obtenerEventoInesperado).toHaveBeenCalledWith(MOCK_ID_EVENTO)
    expect(mockRutasOptimizadasRepository.obtenerRutaOptimaExistente).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(mockRutasOptimizadasRepository.obtenerEquipoReparto).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(mockRutasOptimizadasRepository.obtenerVehiculoPorEquipo).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(mockRutasOptimizadasRepository.obtenerEnviosPendientesPorPrioridad).toHaveBeenCalled()
    expect(mockRutasOptimizadasRepository.obtenerCondicionesTraficoClima).toHaveBeenCalled()
    
    expect(OpenRouteService.calcularRutaOptima).toHaveBeenCalledWith({
      vehiculo: mockVehiculo,
      equipo: mockEquipo,
      envios: mockEnviosPendientes,
      condicionesTrafico: mockCondicionesTrafico,
      eventoInesperado: mockEvento,
    })
    
    expect(OpenRouteService.procesarRespuestaOptimizacion).toHaveBeenCalledWith(
      mockOptimizationResponse,
      MOCK_ID_EQUIPO,
      mockEnviosPendientes,
      MOCK_ID_EVENTO
    )
    
    expect(mockRutasOptimizadasRepository.guardarRutaOptimizada).toHaveBeenCalled()
    compareWithDates(result, mockRutaReplanificada)
  })

  it('debería lanzar una excepción si el evento inesperado no existe', async () => {
    mockRutasOptimizadasRepository.obtenerEventoInesperado.mockResolvedValue(null)
    
    await expect(consultarRutasOptimizadasUseCase.replanificarRuta({
      idEquipo: MOCK_ID_EQUIPO,
      idEvento: MOCK_ID_EVENTO,
    }))
      .rejects
      .toThrow(new RutaOptimizadaException(404, `Evento inesperado con ID ${MOCK_ID_EVENTO} no encontrado`))
    
    expect(mockRutasOptimizadasRepository.obtenerEventoInesperado).toHaveBeenCalledWith(MOCK_ID_EVENTO)
    expect(mockRutasOptimizadasRepository.obtenerRutaOptimaExistente).not.toHaveBeenCalled()
    expect(OpenRouteService.calcularRutaOptima).not.toHaveBeenCalled()
  })

  it('debería lanzar una excepción si el evento no ocurrió hoy', async () => {
    const yesterdayEvent = {
      ...mockEvento,
      created_at: new Date(TODAY.getTime() - 24 * 60 * 60 * 1000),
    }
    
    mockRutasOptimizadasRepository.obtenerEventoInesperado.mockResolvedValue(yesterdayEvent)
    
    await expect(consultarRutasOptimizadasUseCase.replanificarRuta({
      idEquipo: MOCK_ID_EQUIPO,
      idEvento: MOCK_ID_EVENTO,
    }))
      .rejects
      .toThrow(new RutaOptimizadaException(400, 'Solo se puede replanificar por eventos ocurridos hoy'))
    
    expect(mockRutasOptimizadasRepository.obtenerEventoInesperado).toHaveBeenCalledWith(MOCK_ID_EVENTO)
    expect(mockRutasOptimizadasRepository.obtenerRutaOptimaExistente).not.toHaveBeenCalled()
    expect(OpenRouteService.calcularRutaOptima).not.toHaveBeenCalled()
  })

  it('debería lanzar una excepción si el evento no corresponde al equipo especificado', async () => {
    const otherTeamEvent = {
      ...mockEvento,
      id_equipo: 'otro-equipo',
    }
    
    mockRutasOptimizadasRepository.obtenerEventoInesperado.mockResolvedValue(otherTeamEvent)
    
    await expect(consultarRutasOptimizadasUseCase.replanificarRuta({
      idEquipo: MOCK_ID_EQUIPO,
      idEvento: MOCK_ID_EVENTO,
    }))
      .rejects
      .toThrow(new RutaOptimizadaException(400, 'El evento no corresponde al equipo especificado'))
    
    expect(mockRutasOptimizadasRepository.obtenerEventoInesperado).toHaveBeenCalledWith(MOCK_ID_EVENTO)
    expect(mockRutasOptimizadasRepository.obtenerRutaOptimaExistente).not.toHaveBeenCalled()
    expect(OpenRouteService.calcularRutaOptima).not.toHaveBeenCalled()
  })

  it('debería lanzar una excepción si no hay una ruta previa calculada hoy', async () => {
    mockRutasOptimizadasRepository.obtenerEventoInesperado.mockResolvedValue(mockEvento)
    mockRutasOptimizadasRepository.obtenerRutaOptimaExistente.mockResolvedValue(null)
    
    await expect(consultarRutasOptimizadasUseCase.replanificarRuta({
      idEquipo: MOCK_ID_EQUIPO,
      idEvento: MOCK_ID_EVENTO,
    }))
      .rejects
      .toThrow(new RutaOptimizadaException(404, 'No hay una ruta previa calculada hoy para replanificar'))
    
    expect(mockRutasOptimizadasRepository.obtenerEventoInesperado).toHaveBeenCalledWith(MOCK_ID_EVENTO)
    expect(mockRutasOptimizadasRepository.obtenerRutaOptimaExistente).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(OpenRouteService.calcularRutaOptima).not.toHaveBeenCalled()
  })

  it('debería lanzar una excepción si el equipo no está disponible actualmente', async () => {
    const equipoNoDisponible = {
      ...mockEquipo,
      disponibilidad: false
    }
    
    mockRutasOptimizadasRepository.obtenerEventoInesperado.mockResolvedValue(mockEvento)
    mockRutasOptimizadasRepository.obtenerRutaOptimaExistente.mockResolvedValue(mockRutaOptimizada)
    mockRutasOptimizadasRepository.obtenerEquipoReparto.mockResolvedValue(equipoNoDisponible)
    mockRutasOptimizadasRepository.obtenerVehiculoPorEquipo.mockResolvedValue(mockVehiculo)
    mockRutasOptimizadasRepository.obtenerEnviosPendientesPorPrioridad.mockResolvedValue(mockEnviosPendientes)
    
    await expect(consultarRutasOptimizadasUseCase.replanificarRuta({
      idEquipo: MOCK_ID_EQUIPO,
      idEvento: MOCK_ID_EVENTO,
    }))
      .rejects
      .toThrow(new RutaOptimizadaException(400, `El equipo ${MOCK_ID_EQUIPO} no está disponible actualmente`))
    
    expect(mockRutasOptimizadasRepository.obtenerEventoInesperado).toHaveBeenCalledWith(MOCK_ID_EVENTO)
    expect(mockRutasOptimizadasRepository.obtenerRutaOptimaExistente).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(mockRutasOptimizadasRepository.obtenerEquipoReparto).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(OpenRouteService.calcularRutaOptima).not.toHaveBeenCalled()
  })

  it('debería manejar errores generales correctamente', async () => {
    const error = new Error('Error en la replanificación')
    
    mockRutasOptimizadasRepository.obtenerEventoInesperado.mockRejectedValue(error)
    
    await expect(consultarRutasOptimizadasUseCase.replanificarRuta({
      idEquipo: MOCK_ID_EQUIPO,
      idEvento: MOCK_ID_EVENTO,
    }))
      .rejects
      .toThrow(new RutaOptimizadaException(500, `Error al replanificar ruta: ${error.message}`))
  })
})