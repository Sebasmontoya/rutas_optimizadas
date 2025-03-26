import { fastify, FastifyInstance, FastifyReply, FastifyRequest, FastifyPluginAsync, FastifyError } from 'fastify';
import { IModule } from '@common/modules/IModule';
import { HTTPMETODO } from '@common/modules/Ruta';
import { randomBytes } from 'crypto';
import { DefaultErrorModel } from './DefaultError';
import { IServer } from '../IServer';
import CustomError from '@common/util/CustomError';
import { logger } from '@common/logger/Logger';
import { ENV } from '@common/envs';

export class FastifyServer implements IServer {
    port: number = +ENV.PORT;
    app: FastifyInstance;
    routes: Record<string, string>[] = [];
    constructor() {
        this.app = fastify({
            genReqId: (_) => randomBytes(20).toString('hex'),
        });
        this.printRoutes();
        this.errorHandler();
    }
    private printRoutes = (): void => {
        this.app.addHook('onRoute', (r): void => {
            this.routes.push({ url: r.url, method: r.method.toString() });
            // logger.info('ROUTE', r.method.toString(), r.url);
        });
    };
    private errorHandler = () => {
        this.app.setErrorHandler((error, _request, reply) => {
            const Error = error instanceof CustomError ? this.buildResponseError(error) : this.buildDefaultError(error);
            const statusCode = error?.statusCode && +error.statusCode > 0 ? error.statusCode : 500;
            reply.status(statusCode).send(Error);
        });
    };
    buildResponseError(error: CustomError): DefaultErrorModel {
        return {
            statusCode: error.statusCode,
            message: error?.message,
            stack: error?.stack,
            defaultMessage: 'Error handler log',
            isError: error.isCustomError,
            cause: '',
            code: error.statusCode,
            details: error,
        };
    }
    buildDefaultError(error: FastifyError): DefaultErrorModel {
        return {
            message: error?.message ?? 'Error sin mensaje',
            isError: true,
            cause: 'Error sin causa',
            stack: error?.stack ?? 'Error sin stack',
            code: +error?.code ?? 500,
            statusCode: error?.statusCode ?? 500,
            defaultMessage: 'Error handler log',
            details: error,
        };
    }
    addModule = async (module: IModule): Promise<void> => {
        const prefix = `/${ENV.DOMAIN}/${ENV.SERVICE_NAME}`;
        const pluggin: FastifyPluginAsync = async (router) => {
            const rutas = module.getRutas();
            for (const indexRuta in rutas) {
                const ruta = rutas[indexRuta];
                const url = ruta.url;
                const handler = ruta?.handler ?? {};
                switch (ruta.metodo) {
                    case HTTPMETODO.POST:
                        router.post(url, handler, async (req: FastifyRequest<any>, reply: FastifyReply) => {
                            const data = {
                                ...req.body,
                                ...req.params,
                            };
                            const request = {
                                data,
                            };
                            const result = await ruta.evento(request);
                            reply.header('Content-Type', 'application/json');
                            reply.status(result.status).send(JSON.stringify(result.response));
                        });
                        break;
                    case HTTPMETODO.PUT:
                        router.put(url, {}, async (req: FastifyRequest<any>, reply: FastifyReply) => {
                            const request = {
                                data: {
                                    ...req.body,
                                    ...req.params,
                                },
                            };
                            const result = await ruta.evento(request);
                            reply.header('Content-Type', 'application/json');
                            reply.status(result.status).send(JSON.stringify(result.response));
                        });
                        break;
                    case HTTPMETODO.PATCH:
                        router.patch(url, {}, async (req: FastifyRequest<any>, reply: FastifyReply) => {
                            const request = {
                                data: {
                                    ...req.body,
                                    ...req.params,
                                },
                            };
                            const result = await ruta.evento(request);
                            reply.header('Content-Type', 'application/json');
                            reply.status(result.status).send(JSON.stringify(result.response));
                        });
                        break;
                    case HTTPMETODO.DELETE:
                        router.delete(url, {}, async (req: FastifyRequest<any>, reply: FastifyReply) => {
                            const request = {
                                data: {
                                    ...req.body,
                                    ...req.params,
                                },
                            };
                            const result = await ruta.evento(request);
                            reply.header('Content-Type', 'application/json');
                            reply.status(result.status).send(JSON.stringify(result.response));
                        });
                        break;
                    case HTTPMETODO.GET:
                    default:
                        router.get(url, {}, async (req: FastifyRequest<any>, reply: FastifyReply) => {
                            const request = {
                                data: {
                                    ...req.body,
                                    ...req.params,
                                },
                            };
                            const result = await ruta.evento(request);
                            reply.header('Content-Type', 'application/json');
                            reply.status(result.status).send(JSON.stringify(result.response));
                        });
                        break;
                }
            }
        };
        this.app.register(pluggin, {
            prefix: prefix + module.ruta,
        });
    };

    start = async (): Promise<void> => {
        try {
            await this.app.listen({ port: this.port });
            logger.info('FASTIFY', `Application running on port ${this.port}`, { rutas: this.routes });
        } catch (err) {
            logger.error('Fastify error', 'Error al crear la instancia de fastify', err);
            process.exit(1);
        }
    };
}
