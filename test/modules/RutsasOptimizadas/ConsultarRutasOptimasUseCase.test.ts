import { jest, describe, beforeEach, it, expect } from '@jest/globals'
import ConsultarRutasOptimizadasUseCase from '../../../src/modules/RutasOptimizadas/usecase/services/ConsultarRutasOptimasUseCase'
import { DEPENDENCY_CONTAINER } from '../../../src/common/dependencies/DependencyContainer'
import TYPESDEPENDENCIES from '../../../src/modules/RutasOptimizadas/dependencies/TypesDependencies'
import redisClient from '../../../src/infrastructure/redis/RedisClient'
import { RutasOptimizadasRepository } from '../../../src/modules/RutasOptimizadas/domain/repositories/RutasOptimizadasRepository'
import { 
  MOCK_ID_EQUIPO,
  mockRutaOptimizada,
  createMockRepository,
  compareWithDates
} from './__mocks__/rutas-optimizadas.mocks'

jest.mock('../../../src/infrastructure/redis/RedisClient', () => ({
  get: jest.fn(),
  setEx: jest.fn(),
}))

jest.mock('../../../src/common/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

describe('ConsultarRutasOptimizadasUseCase', () => {
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

  describe('execute', () => {
    it('debería devolver la ruta desde Redis si existe en caché', async () => {
      const cacheKey = `ruta_optima:${MOCK_ID_EQUIPO}`
      
      const mockRutaOptimizadaJSON = JSON.parse(JSON.stringify(mockRutaOptimizada))
      jest.spyOn(redisClient, 'get').mockResolvedValue(JSON.stringify(mockRutaOptimizadaJSON))
      
      const result = await consultarRutasOptimizadasUseCase.execute({ idEquipo: MOCK_ID_EQUIPO })
      
      expect(redisClient.get).toHaveBeenCalledWith(cacheKey)
      expect(mockRutasOptimizadasRepository.obtenerRutaOptimaExistente).not.toHaveBeenCalled()
      expect(result).toEqual(mockRutaOptimizadaJSON)
    })

    it('debería obtener la ruta desde la base de datos y guardarla en caché si no existe en Redis', async () => {
      const cacheKey = `ruta_optima:${MOCK_ID_EQUIPO}`
      
      jest.spyOn(redisClient, 'get').mockResolvedValue(null)
      mockRutasOptimizadasRepository.obtenerRutaOptimaExistente.mockResolvedValue(mockRutaOptimizada)
      
      const result = await consultarRutasOptimizadasUseCase.execute({ idEquipo: MOCK_ID_EQUIPO })
      
      expect(redisClient.get).toHaveBeenCalledWith(cacheKey)
      expect(mockRutasOptimizadasRepository.obtenerRutaOptimaExistente).toHaveBeenCalledWith(MOCK_ID_EQUIPO)
      expect(redisClient.setEx).toHaveBeenCalledWith(
        cacheKey,
        1800,
        JSON.stringify(mockRutaOptimizada)
      )
      compareWithDates(result, mockRutaOptimizada)
    })

    it('debería devolver un array vacío si no hay ruta óptima existente', async () => {
      jest.spyOn(redisClient, 'get').mockResolvedValue(null)
      mockRutasOptimizadasRepository.obtenerRutaOptimaExistente.mockResolvedValue(null)
      
      const result = await consultarRutasOptimizadasUseCase.execute({ idEquipo: MOCK_ID_EQUIPO })
      
      expect(result).toEqual([])
    })

    it('debería manejar errores correctamente', async () => {
      const error = new Error('Error de conexión a la base de datos')
      jest.spyOn(redisClient, 'get').mockRejectedValue(error)
      
      await expect(consultarRutasOptimizadasUseCase.execute({ idEquipo: MOCK_ID_EQUIPO })).rejects.toThrow(error)
    })
  })
})