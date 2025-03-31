export interface UsuarioAuthEntity {
    id_usuario: string
    nombre_usuario: string
    contrasena_hash: string
    roles?: string[]
    ultimo_acceso?: Date
    activo?: boolean
}
