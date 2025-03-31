export default class RutaOptimizadaException extends Error {
    public readonly statusCode: number

    public readonly isOperational: boolean

    constructor(statusCode: number, message: string, isOperational = true) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational

        Object.setPrototypeOf(this, RutaOptimizadaException.prototype)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
