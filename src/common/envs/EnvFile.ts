import path from 'path';
import { existsSync } from 'fs';

export const getEnvFile = (): string => {
    const envPath = path.resolve('local.env');
    if (existsSync(envPath)) return envPath;
    return '.env';
};
