import ENV from '@common/envs/Envs'
import { createClient } from 'redis'
import { logger } from '@common/logger'

const formattedRedisUrl = `redis://${ENV.REDIS}`

/**
 * Cliente Redis compartido para la aplicación
 */
const redisClient = createClient({ url: formattedRedisUrl })
redisClient.on('error', (err) => logger.error('REDIS', 'connection', [`Redis Client Error: ${err.message}`]))
redisClient.connect().catch((err) => logger.error('REDIS', 'connect', [`Failed to connect to Redis: ${err.message}`]))
export default redisClient
