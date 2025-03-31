import { BadRequestSchema, RepositoryErrorSchema } from '../../../common/swagger/errors'

interface SuccessResponseSchemaType {
    description: string
    type: 'object'
    properties: {
        isError: {
            type: 'boolean'
            example: boolean
            description: string
        }
        data: {
            type: 'object'
            properties: {
                ok: {
                    type: 'string'
                    description: string
                }
                data: Record<string, unknown>
            }
        }
    }
}

interface ErrorDetailsType {
    code: {
        type: 'integer'
        example: number
        description: string
    }
    message: {
        type: 'string'
        example: string
        description: string
    }
}

interface ErrorNotFoundSchemaType {
    description: string
    type: 'object'
    properties: {
        isError: {
            type: 'boolean'
            example: boolean
            description: string
        }
        error: {
            type: 'object'
            properties: ErrorDetailsType
        }
    }
}

// ===== Esquemas de entrada =====
/**
 * @swagger
 * components:
 *   schemas:
 *     ConsultarRutasOptimizadas:
 *       type: object
 *       properties:
 *         idEquipo:
 *           type: string
 *           description: Identificador único del equipo de reparto
 *       required:
 *         - idEquipo
 */
export const ConsultarRutasOptimizadasSchema = {
    type: 'object',
    properties: {
        idEquipo: { type: 'string', description: 'Identificador único del equipo de reparto' },
    },
    required: ['idEquipo'],
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CalcularRutaOptima:
 *       type: object
 *       properties:
 *         idEquipo:
 *           type: string
 *           description: Identificador único del equipo de reparto
 *       required:
 *         - idEquipo
 */
export const CalcularRutaOptimaSchema = {
    type: 'object',
    properties: {
        idEquipo: { type: 'string', description: 'Identificador único del equipo de reparto' },
    },
    required: ['idEquipo'],
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ReplanificarRuta:
 *       type: object
 *       properties:
 *         idEquipo:
 *           type: string
 *           description: Identificador único del equipo de reparto
 *         idEvento:
 *           type: string
 *           description: Identificador único del evento inesperado
 *       required:
 *         - idEquipo
 *         - idEvento
 */
export const ReplanificarRutaSchema = {
    type: 'object',
    properties: {
        idEquipo: { type: 'string', description: 'Identificador único del equipo de reparto' },
        idEvento: { type: 'string', description: 'Identificador único del evento inesperado' },
    },
    required: ['idEquipo', 'idEvento'],
}

/**
 * @swagger
 * components:
 *   schemas:
 *     RegistrarEventoInesperado:
 *       type: object
 *       properties:
 *         idEquipo:
 *           type: string
 *           description: Identificador único del equipo de reparto
 *         descripcion:
 *           type: string
 *           description: Descripción detallada del evento inesperado
 *         tipo:
 *           type: string
 *           enum: [trafico, clima, vehiculo]
 *           description: Tipo de evento inesperado
 *       required:
 *         - idEquipo
 *         - descripcion
 *         - tipo
 */
export const RegistrarEventoInesperadoSchema = {
    type: 'object',
    properties: {
        idEquipo: { type: 'string', description: 'Identificador único del equipo de reparto' },
        descripcion: { type: 'string', description: 'Descripción detallada del evento inesperado' },
        tipo: {
            type: 'string',
            enum: ['trafico', 'clima', 'vehiculo'],
            description: 'Tipo de evento inesperado',
        },
    },
    required: ['idEquipo', 'descripcion', 'tipo'],
}

// ===== Esquemas de modelos =====
/**
 * @swagger
 * components:
 *   schemas:
 *     RutaOptima:
 *       type: object
 *       properties:
 *         envios:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de IDs de envíos incluidos en la ruta
 *         distancia_total:
 *           type: number
 *           description: Distancia total de la ruta en kilómetros
 *         duracion_total:
 *           type: number
 *           description: Duración estimada de la ruta en minutos
 *         steps:
 *           type: array
 *           description: Pasos detallados de la ruta para navegación
 */
const RutaOptimaModel = {
    type: 'object',
    properties: {
        envios: {
            type: 'array',
            items: { type: 'string' },
            description: 'Lista de IDs de envíos incluidos en la ruta',
        },
        distancia_total: {
            type: 'number',
            description: 'Distancia total de la ruta en kilómetros',
        },
        duracion_total: {
            type: 'number',
            description: 'Duración estimada de la ruta en minutos',
        },
        steps: {
            type: 'array',
            description: 'Pasos detallados de la ruta para navegación',
            items: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'Tipo de paso (inicio, entrega, fin)',
                    },
                    location: {
                        type: 'array',
                        items: { type: 'number' },
                        minItems: 2,
                        maxItems: 2,
                        description: 'Coordenadas [longitud, latitud] del punto',
                    },
                },
            },
        },
    },
}

/**
 * @swagger
 * components:
 *   schemas:
 *     EnvioPendiente:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único del envío
 *         destino:
 *           type: object
 *           description: Coordenadas geográficas del destino
 *         direccion_destino:
 *           type: string
 *           description: Dirección física de entrega
 */
const EnvioPendienteModel = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            description: 'Identificador único del envío',
        },
        destino: {
            type: 'object',
            description: 'Coordenadas geográficas del destino',
            properties: {
                type: {
                    type: 'string',
                    example: 'Point',
                    description: 'Tipo de geometría GeoJSON',
                },
                coordinates: {
                    type: 'array',
                    items: { type: 'number' },
                    minItems: 2,
                    maxItems: 2,
                    description: 'Coordenadas [longitud, latitud] del destino',
                },
            },
        },
        direccion_destino: {
            type: 'string',
            description: 'Dirección física de entrega',
        },
        ciudad_destino: {
            type: 'string',
            description: 'Ciudad de entrega',
        },
        departamento_destino: {
            type: 'string',
            description: 'Departamento o provincia de entrega',
        },
        peso_carga: {
            type: 'number',
            description: 'Peso de la carga en kilogramos',
        },
        sla_entrega: {
            type: 'string',
            description: 'Tiempo comprometido para la entrega',
        },
        estado: {
            type: 'string',
            description: 'Estado actual del envío',
        },
        prioridad: {
            type: 'number',
            description: 'Nivel de prioridad del envío (menor número = mayor prioridad)',
        },
    },
}

/**
 * @swagger
 * components:
 *   schemas:
 *     RutaOptimizada:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único de la ruta optimizada
 */
const RutaOptimizadaModel = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            description: 'Identificador único de la ruta optimizada',
        },
        id_equipo: {
            type: 'string',
            description: 'Identificador del equipo de reparto asignado',
        },
        fecha: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación o actualización de la ruta',
        },
        ruta_optima: {
            ...RutaOptimaModel,
            description: 'Detalles de la ruta optimizada',
        },
        id_evento: {
            type: 'string',
            description: 'Identificador del evento que causó replanificación (si aplica)',
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha y hora de creación del registro',
        },
    },
}

/**
 * @swagger
 * components:
 *   schemas:
 *     EventoInesperado:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único del evento inesperado
 */
const EventoInesperadoModel = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            description: 'Identificador único del evento inesperado',
        },
        id_equipo: {
            type: 'string',
            description: 'Identificador del equipo de reparto afectado',
        },
        descripcion: {
            type: 'string',
            description: 'Descripción detallada del evento',
        },
        tipo: {
            type: 'string',
            enum: ['trafico', 'clima', 'vehiculo'],
            description: 'Categoría del evento inesperado',
        },
        id_evento: {
            type: 'string',
            description: 'Identificador secundario del evento',
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha y hora de registro del evento',
        },
    },
}

// ===== Funciones para generar respuestas =====
/**
 * Genera un esquema de respuesta exitosa
 * @param description Descripción de la respuesta
 * @param data Datos específicos de la respuesta
 * @returns Esquema estructurado para respuesta exitosa
 */
const createSuccessResponseSchema = (
    description: string,
    data: Record<string, unknown>,
): SuccessResponseSchemaType => ({
    description,
    type: 'object',
    properties: {
        isError: {
            type: 'boolean',
            example: false,
            description: 'Indicador de error (false para respuestas exitosas)',
        },
        data: {
            type: 'object',
            properties: {
                ok: {
                    type: 'string',
                    description: 'Mensaje de confirmación',
                },
                data,
            },
        },
    },
})

/**
 * Genera un esquema de respuesta de error 404
 * @param message Mensaje descriptivo del error
 * @returns Esquema estructurado para respuesta de error
 */
const createErrorNotFoundSchema = (message: string): ErrorNotFoundSchemaType => ({
    description: 'Recurso no encontrado',
    type: 'object',
    properties: {
        isError: {
            type: 'boolean',
            example: true,
            description: 'Indicador de error (true para respuestas con error)',
        },
        error: {
            type: 'object',
            properties: {
                code: {
                    type: 'integer',
                    example: 404,
                    description: 'Código de estado HTTP',
                },
                message: {
                    type: 'string',
                    example: message,
                    description: 'Mensaje descriptivo del error',
                },
            },
        },
    },
})

// ===== Definición de rutas y operaciones =====
/**
 * @swagger
 * tags:
 *   - name: rutas optimizadas
 *     description: Operaciones relacionadas con la gestión de rutas optimizadas
 */
const RutasOptimizadasSchema = {
    /**
     * @swagger
     * /rutas-optimizadas/{idEquipo}:
     *   get:
     *     summary: Consultar ruta optimizada existente
     *     description: Obtiene la ruta optimizada actual para un equipo de reparto o lista de envíos pendientes si no hay ruta
     *     tags: [rutas optimizadas]
     */
    consultarRutasOptimizadas: {
        description: 'Consultar ruta optimizada existente para un equipo de reparto',
        tags: ['rutas optimizadas'],
        params: ConsultarRutasOptimizadasSchema,
        response: {
            200: createSuccessResponseSchema('Consulta exitosa de ruta optimizada', {
                oneOf: [
                    {
                        ...RutaOptimizadaModel,
                        description: 'Datos de la ruta optimizada existente',
                    },
                    {
                        type: 'array',
                        items: EnvioPendienteModel,
                        description: 'Lista de envíos pendientes cuando no existe una ruta',
                    },
                ],
            }),
            400: BadRequestSchema,
            500: RepositoryErrorSchema,
        },
    },

    /**
     * @swagger
     * /rutas-optimizadas/calcular:
     *   post:
     *     summary: Calcular una nueva ruta óptima
     *     description: Calcula la ruta óptima para un equipo de reparto basado en los envíos pendientes
     *     tags: [rutas optimizadas]
     */
    calcularRutaOptima: {
        description: 'Calcular una nueva ruta óptima para un equipo de reparto',
        tags: ['rutas optimizadas'],
        body: CalcularRutaOptimaSchema,
        response: {
            200: createSuccessResponseSchema('Ruta optimizada calculada exitosamente', {
                ...RutaOptimizadaModel,
                description: 'Datos de la nueva ruta optimizada',
            }),
            400: BadRequestSchema,
            404: createErrorNotFoundSchema('No hay envíos pendientes para optimizar'),
            500: RepositoryErrorSchema,
        },
    },

    /**
     * @swagger
     * /rutas-optimizadas/replanificar:
     *   post:
     *     summary: Replanificar una ruta
     *     description: Replanifica una ruta debido a un evento inesperado
     *     tags: [rutas optimizadas]
     */
    replanificarRuta: {
        description: 'Replanificar una ruta debido a un evento inesperado',
        tags: ['rutas optimizadas'],
        body: ReplanificarRutaSchema,
        response: {
            200: createSuccessResponseSchema('Ruta replanificada exitosamente', {
                ...RutaOptimizadaModel,
                description: 'Datos de la ruta replanificada',
            }),
            400: BadRequestSchema,
            404: createErrorNotFoundSchema('No hay una ruta previa calculada hoy para replanificar'),
            500: RepositoryErrorSchema,
        },
    },

    /**
     * @swagger
     * /rutas-optimizadas/eventos:
     *   post:
     *     summary: Registrar evento inesperado
     *     description: Registra un evento inesperado que puede afectar a una ruta
     *     tags: [rutas optimizadas]
     */
    registrarEventoInesperado: {
        description: 'Registrar un evento inesperado que puede afectar a una ruta',
        tags: ['rutas optimizadas'],
        body: RegistrarEventoInesperadoSchema,
        response: {
            201: createSuccessResponseSchema('Evento inesperado registrado exitosamente', {
                ...EventoInesperadoModel,
                description: 'Datos del evento inesperado registrado',
            }),
            400: BadRequestSchema,
            404: createErrorNotFoundSchema('Equipo de reparto no encontrado'),
            500: RepositoryErrorSchema,
        },
    },
}

export default RutasOptimizadasSchema
