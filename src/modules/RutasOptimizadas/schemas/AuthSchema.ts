export default {
    login: {
        body: {
            type: 'object',
            required: ['nombre_usuario', 'contrasena'],
            properties: {
                nombre_usuario: { type: 'string' },
                contrasena: { type: 'string' },
            },
        },
    },
}
