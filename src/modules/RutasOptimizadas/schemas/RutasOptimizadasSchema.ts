import { BadRequestSchema, RepositoryErrorSchema } from '../../../common/swagger/errors'

const GeolocalizacionSchema = {
    consultarPaises: {
        description: 'Consultar listado de paises',
        tags: ['Geolocalizacion'],
        response: {
            200: {
                description: 'Se consultaron correctamente los paises',
                type: 'object',
                properties: {
                    isError: { type: 'boolean', example: false },
                    data: {
                        type: 'object',
                        properties: {
                            ok: { type: 'string', example: 'Se consultaron correctamente los paises' },
                            data: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id_pais: { type: 'integer' },
                                        nombre: { type: 'string' },
                                        codigo_iata: { type: 'string' },
                                        codigo_iso: { type: 'string' },
                                        codigo_pais: { type: 'integer' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            400: BadRequestSchema,
            500: RepositoryErrorSchema,
        },
    },
    consultarDepartamentos: {
        description: 'Consultar listado de paises',
        tags: ['Geolocalizacion'],
        params: {
            type: 'object',
            properties: {
                idPais: { type: 'integer' },
            },
        },
        response: {
            200: {
                description: 'Se consultaron correctamente los departamentos',
                type: 'object',
                properties: {
                    isError: { type: 'boolean', example: false },
                    data: {
                        type: 'object',
                        properties: {
                            ok: { type: 'string', example: 'Se consultaron correctamente los departamentos' },
                            data: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id_departamento: { type: 'integer' },
                                        nombre: { type: 'string' },
                                        abreviado: { type: 'string' },
                                        id_pais: { type: 'integer' },
                                        codigo_departamento: { type: 'integer' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            400: BadRequestSchema,
            500: RepositoryErrorSchema,
        },
    },
    consultarCiudades: {
        description: 'Consultar listado de paises',
        tags: ['Geolocalizacion'],
        params: {
            type: 'object',
            properties: {
                idDepartamento: { type: 'integer' },
            },
        },
        response: {
            200: {
                description: 'Se consultaron correctamente las ciudades',
                type: 'object',
                properties: {
                    isError: { type: 'boolean', example: false },
                    data: {
                        type: 'object',
                        properties: {
                            ok: { type: 'string', example: 'Se consultaron correctamente las ciudades' },
                            data: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id_ciudad: { type: 'integer' },
                                        nombre: { type: 'string' },
                                        codigo_ciudad: { type: 'string' },
                                        codigo_dane: { type: 'string' },
                                        codigo_postal: { type: 'string' },
                                        id_departamento: { type: 'integer' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            400: BadRequestSchema,
            500: RepositoryErrorSchema,
        },
    },
    consultarTiposVia: {
        description: 'Consultar listado de paises',
        tags: ['Geolocalizacion'],
        response: {
            200: {
                description: 'Se consultaron correctamente los tipos de vía',
                type: 'object',
                properties: {
                    isError: { type: 'boolean', example: false },
                    data: {
                        type: 'object',
                        properties: {
                            ok: { type: 'string', example: 'Se consultaron correctamente los tipos de vía' },
                            data: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id_tipo_via: { type: 'integer' },
                                        descripcion: { type: 'string' },
                                        formato_detallado: { type: 'boolean' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            400: BadRequestSchema,
            500: RepositoryErrorSchema,
        },
    },
}

export default GeolocalizacionSchema
