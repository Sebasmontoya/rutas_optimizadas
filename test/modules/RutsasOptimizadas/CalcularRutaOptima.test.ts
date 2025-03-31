
import { jest, describe, beforeEach, it, expect } from '@jest/globals'
import ConsultarRutasOptimizadasUseCase from '../../../src/modules/RutasOptimizadas/usecase/services/ConsultarRutasOptimasUseCase'
import { DEPENDENCY_CONTAINER } from '../../../src/common/dependencies/DependencyContainer'
import TYPESDEPENDENCIES from '../../../src/modules/RutasOptimizadas/dependencies/TypesDependencies'
import OpenRouteService from '../../../src/modules/RutasOptimizadas/domain/services/OpenRouteService'
import RutaOptimizadaException from '../../../src/common/http/exceptions/RutaOptimizadaException'
import { RutasOptimizadasRepository } from '../../../src/modules/RutasOptimizadas/domain/repositories/RutasOptimizadasRepository'
import { 
  MOCK_ID_EQUIPO,
  mockEquipo,
  mockVehiculo,
  mockEnviosPendientes,
  mockCondicionesTrafico,
  mockRutaOptimizada,
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

describe('ConsultarRutasOptimizadasUseCase - calcularRutaOptima', () => {
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

  it('debería devolver la ruta existente si ya hay una calculada para el equipo', async () => {
    mockRutasOptimizadasRepository.obtenerRutaOptimaExistente.mockResolvedValue(mockRutaOptimizada)
    
    const result = await consultarRutasOptimizadasUseCase.calcularRutaOptima({ idEquipo: MOCK_ID_EQUIPO })
    
    expect(mockRutasOptimizadasRepository.obtenerRutaOptimaExistente).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(OpenRouteService.calcularRutaOptima).not.toHaveBeenCalled()
    compareWithDates(result, mockRutaOptimizada)
  })

  it('debería calcular una nueva ruta óptima cuando no existe una previa', async () => {
    mockRutasOptimizadasRepository.obtenerRutaOptimaExistente.mockResolvedValue(null)
    mockRutasOptimizadasRepository.obtenerEquipoReparto.mockResolvedValue(mockEquipo)
    mockRutasOptimizadasRepository.obtenerVehiculoPorEquipo.mockResolvedValue(mockVehiculo)
    mockRutasOptimizadasRepository.obtenerEnviosPendientesPorPrioridad.mockResolvedValue(mockEnviosPendientes)
    mockRutasOptimizadasRepository.obtenerCondicionesTraficoClima.mockResolvedValue(mockCondicionesTrafico)
    
    jest.spyOn(OpenRouteService, 'calcularRutaOptima').mockResolvedValue(mockOptimizationResponse)
    jest.spyOn(OpenRouteService, 'procesarRespuestaOptimizacion').mockReturnValue({
      id_equipo: MOCK_ID_EQUIPO,
      fecha: new Date(),
      ruta_optima: mockRutaOptimizada.ruta_optima,
    })
    
    mockRutasOptimizadasRepository.guardarRutaOptimizada.mockResolvedValue(mockRutaOptimizada)
    
    const result = await consultarRutasOptimizadasUseCase.calcularRutaOptima({ idEquipo: MOCK_ID_EQUIPO })
    
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
    })
    
    expect(OpenRouteService.procesarRespuestaOptimizacion).toHaveBeenCalledWith(
      mockOptimizationResponse,
      MOCK_ID_EQUIPO,
      mockEnviosPendientes
    )
    
    expect(mockRutasOptimizadasRepository.guardarRutaOptimizada).toHaveBeenCalled()
    compareWithDates(result, mockRutaOptimizada)
  })

  it('debería lanzar una excepción si el equipo no existe', async () => {
    mockRutasOptimizadasRepository.obtenerRutaOptimaExistente.mockResolvedValue(null)
    mockRutasOptimizadasRepository.obtenerEquipoReparto.mockResolvedValue(null)
    
    await expect(consultarRutasOptimizadasUseCase.calcularRutaOptima({ idEquipo: MOCK_ID_EQUIPO }))
      .rejects
      .toThrow(new RutaOptimizadaException(400, `Equipo de reparto con ID ${MOCK_ID_EQUIPO} no encontrado`))
    
    expect(mockRutasOptimizadasRepository.obtenerRutaOptimaExistente).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(mockRutasOptimizadasRepository.obtenerEquipoReparto).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(OpenRouteService.calcularRutaOptima).not.toHaveBeenCalled()
  })

  it('debería lanzar una excepción si no hay un vehículo asignado al equipo', async () => {
    mockRutasOptimizadasRepository.obtenerRutaOptimaExistente.mockResolvedValue(null)
    mockRutasOptimizadasRepository.obtenerEquipoReparto.mockResolvedValue(mockEquipo)
    mockRutasOptimizadasRepository.obtenerVehiculoPorEquipo.mockResolvedValue(null)
    
    await expect(consultarRutasOptimizadasUseCase.calcularRutaOptima({ idEquipo: MOCK_ID_EQUIPO }))
      .rejects
      .toThrow(new RutaOptimizadaException(400, `No se encontró vehículo asignado al equipo ${MOCK_ID_EQUIPO}`))
    
    expect(mockRutasOptimizadasRepository.obtenerRutaOptimaExistente).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(mockRutasOptimizadasRepository.obtenerEquipoReparto).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(mockRutasOptimizadasRepository.obtenerVehiculoPorEquipo).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(OpenRouteService.calcularRutaOptima).not.toHaveBeenCalled()
  })

  it('debería lanzar una excepción si no hay envíos pendientes', async () => {
    mockRutasOptimizadasRepository.obtenerRutaOptimaExistente.mockResolvedValue(null)
    mockRutasOptimizadasRepository.obtenerEquipoReparto.mockResolvedValue(mockEquipo)
    mockRutasOptimizadasRepository.obtenerVehiculoPorEquipo.mockResolvedValue(mockVehiculo)
    mockRutasOptimizadasRepository.obtenerEnviosPendientesPorPrioridad.mockResolvedValue([])
    
    await expect(consultarRutasOptimizadasUseCase.calcularRutaOptima({ idEquipo: MOCK_ID_EQUIPO }))
      .rejects
      .toThrow(new RutaOptimizadaException(400, 'No hay envíos pendientes para optimizar'))
    
    expect(mockRutasOptimizadasRepository.obtenerRutaOptimaExistente).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(mockRutasOptimizadasRepository.obtenerEquipoReparto).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(mockRutasOptimizadasRepository.obtenerVehiculoPorEquipo).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(mockRutasOptimizadasRepository.obtenerEnviosPendientesPorPrioridad).toHaveBeenCalled()
    expect(OpenRouteService.calcularRutaOptima).not.toHaveBeenCalled()
  })

  it('debería lanzar una excepción si el equipo no está disponible', async () => {
    const equipoNoDisponible = {
      ...mockEquipo,
      disponibilidad: false
    }
    
    mockRutasOptimizadasRepository.obtenerRutaOptimaExistente.mockResolvedValue(null)
    mockRutasOptimizadasRepository.obtenerEquipoReparto.mockResolvedValue(equipoNoDisponible)
    mockRutasOptimizadasRepository.obtenerVehiculoPorEquipo.mockResolvedValue(mockVehiculo)
    mockRutasOptimizadasRepository.obtenerEnviosPendientesPorPrioridad.mockResolvedValue(mockEnviosPendientes)
    
    await expect(consultarRutasOptimizadasUseCase.calcularRutaOptima({ idEquipo: MOCK_ID_EQUIPO }))
      .rejects
      .toThrow(new RutaOptimizadaException(400, `El equipo ${MOCK_ID_EQUIPO} no está disponible actualmente`))
    
    expect(mockRutasOptimizadasRepository.obtenerRutaOptimaExistente).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(mockRutasOptimizadasRepository.obtenerEquipoReparto).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(OpenRouteService.calcularRutaOptima).not.toHaveBeenCalled()
  })

  it('debería manejar errores de la API externa correctamente', async () => {
    const apiError = new Error('Error en la API de optimización de rutas')
    
    mockRutasOptimizadasRepository.obtenerRutaOptimaExistente.mockResolvedValue(null)
    mockRutasOptimizadasRepository.obtenerEquipoReparto.mockResolvedValue(mockEquipo)
    mockRutasOptimizadasRepository.obtenerVehiculoPorEquipo.mockResolvedValue(mockVehiculo)
    mockRutasOptimizadasRepository.obtenerEnviosPendientesPorPrioridad.mockResolvedValue(mockEnviosPendientes)
    mockRutasOptimizadasRepository.obtenerCondicionesTraficoClima.mockResolvedValue(mockCondicionesTrafico)
    
    jest.spyOn(OpenRouteService, 'calcularRutaOptima').mockRejectedValue(apiError)
    
    await expect(consultarRutasOptimizadasUseCase.calcularRutaOptima({ idEquipo: MOCK_ID_EQUIPO }))
      .rejects
      .toThrow(new RutaOptimizadaException(500, `Error al calcular ruta óptima: ${apiError.message}`))
  })
})