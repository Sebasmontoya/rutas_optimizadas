import { jest, describe, beforeEach, it, expect } from '@jest/globals'
import ConsultarRutasOptimizadasUseCase from '../../../src/modules/RutasOptimizadas/usecase/services/ConsultarRutasOptimasUseCase'
import { DEPENDENCY_CONTAINER } from '../../../src/common/dependencies/DependencyContainer'
import TYPESDEPENDENCIES from '../../../src/modules/RutasOptimizadas/dependencies/TypesDependencies'
import RutaOptimizadaException from '../../../src/common/http/exceptions/RutaOptimizadaException'
import { RutasOptimizadasRepository } from '../../../src/modules/RutasOptimizadas/domain/repositories/RutasOptimizadasRepository'
import { IEventoInesperadoIn } from '../../../src/modules/RutasOptimizadas/usecase/dto/in'
import { 
  MOCK_ID_EQUIPO,
  MOCK_ID_EVENTO,
  mockEquipo,
  mockEvento,
  createMockRepository,
  compareWithDates
} from './__mocks__/rutas-optimizadas.mocks'

jest.mock('../../../src/common/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

describe('ConsultarRutasOptimizadasUseCase - registrarEventoInesperado', () => {
  let consultarRutasOptimizadasUseCase: ConsultarRutasOptimizadasUseCase
  let mockRutasOptimizadasRepository: jest.Mocked<RutasOptimizadasRepository>

  const mockEventoInesperadoIn: IEventoInesperadoIn = {
    idEquipo: MOCK_ID_EQUIPO,
    descripcion: 'Accidente en la vía principal',
    tipo: 'trafico',
    id_evento: MOCK_ID_EVENTO,
  }

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

  it('debería registrar un evento inesperado correctamente', async () => {
    mockRutasOptimizadasRepository.obtenerEquipoReparto.mockResolvedValue(mockEquipo)
    mockRutasOptimizadasRepository.registrarEventoInesperado.mockResolvedValue(mockEvento)
    
    const result = await consultarRutasOptimizadasUseCase.registrarEventoInesperado(mockEventoInesperadoIn)
    
    expect(mockRutasOptimizadasRepository.obtenerEquipoReparto).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(mockRutasOptimizadasRepository.registrarEventoInesperado).toHaveBeenCalledWith({
      id_equipo: MOCK_ID_EQUIPO,
      descripcion: mockEventoInesperadoIn.descripcion,
      tipo: mockEventoInesperadoIn.tipo,
      id_evento: mockEventoInesperadoIn.id_evento,
    })
    
    compareWithDates(result, mockEvento)
  })

  it('debería lanzar una excepción si el equipo no existe', async () => {
    mockRutasOptimizadasRepository.obtenerEquipoReparto.mockResolvedValue(null)
    
    await expect(consultarRutasOptimizadasUseCase.registrarEventoInesperado(mockEventoInesperadoIn))
      .rejects
      .toThrow(new RutaOptimizadaException(404, `Equipo de reparto con ID ${MOCK_ID_EQUIPO} no encontrado`))
    
    expect(mockRutasOptimizadasRepository.obtenerEquipoReparto).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(mockRutasOptimizadasRepository.registrarEventoInesperado).not.toHaveBeenCalled()
  })

  it('debería manejar errores del repositorio correctamente', async () => {
    const repositoryError = new Error('Error al registrar el evento en la base de datos')
    
    mockRutasOptimizadasRepository.obtenerEquipoReparto.mockResolvedValue(mockEquipo)
    mockRutasOptimizadasRepository.registrarEventoInesperado.mockRejectedValue(repositoryError)
    
    await expect(consultarRutasOptimizadasUseCase.registrarEventoInesperado(mockEventoInesperadoIn))
      .rejects
      .toThrow(new RutaOptimizadaException(500, `Error al registrar evento inesperado: ${repositoryError.message}`))
    
    expect(mockRutasOptimizadasRepository.obtenerEquipoReparto).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(mockRutasOptimizadasRepository.registrarEventoInesperado).toHaveBeenCalled()
  })

  it('debería manejar errores específicos de RutaOptimizadaException', async () => {
    const specificError = new RutaOptimizadaException(400, 'Error específico de validación')
    
    mockRutasOptimizadasRepository.obtenerEquipoReparto.mockResolvedValue(mockEquipo)
    mockRutasOptimizadasRepository.registrarEventoInesperado.mockRejectedValue(specificError)
    
    await expect(consultarRutasOptimizadasUseCase.registrarEventoInesperado(mockEventoInesperadoIn))
      .rejects
      .toThrow(specificError)
    
    expect(mockRutasOptimizadasRepository.obtenerEquipoReparto).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
    expect(mockRutasOptimizadasRepository.registrarEventoInesperado).toHaveBeenCalled()
  })
})