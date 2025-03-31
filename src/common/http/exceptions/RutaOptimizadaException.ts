export default class RutaOptimizadaException extends Error {
    public readonly statusCode: number

    public readonly isOperational: boolean

    constructor(statusCode: number, message: string, isOperational = true) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational

        // Mantener la cadena de prototipos correcta
        Object.setPrototypeOf(this, RutaOptimizadaException.prototype)

        // Capturar la pila de llamadas
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
