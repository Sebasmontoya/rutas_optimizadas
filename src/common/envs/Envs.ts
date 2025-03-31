import dotenv from 'dotenv'
import validateEnvs from './Validate'
import getEnvFile from './EnvFile'

const isTestingJestEnv = process.env.NODE_ENV === 'test'

dotenv.config({
    path: getEnvFile(),
})

const ENV = {
    POSTGRES_HOST: process.env.POSTGRES_HOST as string,
    DOMAIN: process.env.DOMAIN || 'wms',
    SERVICE_NAME: process.env.SERVICE_NAME || 'template-backend-ms',
    PROJECT_ID: process.env.PROJECT_ID || 'nombre-proyecto',
    ENV: process.env.ENV || 'local',
    HOST: process.env.HOST || 'localhost',
    PG_PORT: process.env.PG_PORT || '5432',
    POSTGRES_USER: process.env.POSTGRES_USER || 'user',
    POSTGRES_PASS: process.env.POSTGRES_PASS || 'zBAaKtsErfM',
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE || '',
    PORT: process.env.PORT || '8080',
    PREFIX_LOGGER: process.env.PREFIX_LOGGER || 'template-backend-ms',
    LOGGER_LEVEL: process.env.LOGGER_LEVEL || 'false',
    VERSION: process.env.VERSION ?? 'v1',
    OPEN_ROUTE_SERVICE_API_KEY: process.env.OPEN_ROUTE_SERVICE_API_KEY || '',
    URL_OPEN_ROUTE_SERVICE: process.env.URL_OPEN_ROUTE_SERVICE || 'https://api.openrouteservice.org/optimization',
    REDIS: `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
}

if (!isTestingJestEnv) validateEnvs(ENV)

export default ENV
