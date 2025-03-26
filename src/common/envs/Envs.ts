import { validateEnvs } from '@common/envs/Validate';
import dotenv from 'dotenv';
import { getEnvFile } from './EnvFile';

const isTestingJestEnv = process.env.NODE_ENV === 'test';

dotenv.config({
    path: getEnvFile(),
});

export const ENV = {
    POSTGRES_HOST: process.env.POSTGRES_HOST || 'dbcmtest.loc',
    DOMAIN: process.env.DOMAIN || 'nys',
    SERVICE_NAME: process.env.SERVICE_NAME || 'cm-nys-entregas-ms',
    PROJECT_ID: process.env.PROJECT_ID || 'cm-nys-dev',
    ENV: process.env.ENV || 'local',
    PG_PORT: process.env.PG_PORT || '5432',
    POSTGRES_USER: process.env.POSTGRES_USER || 'usernys',
    POSTGRES_PASS: process.env.POSTGRES_PASS || 'zBAaKtsErfM',
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE || 'nys',
    PORT: process.env.PORT || '8080',
    PREFIX_LOGGER: process.env.PREFIX_LOGGER || 'nys',
    LOGGER_LEVEL: process.env.LOGGER_LEVEL || 'false',

};

if (!isTestingJestEnv) validateEnvs(ENV);
