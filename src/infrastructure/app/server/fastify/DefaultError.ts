export interface DefaultErrorModel {
    message: string;
    isError: boolean;
    cause: unknown;
    stack?: string; // TODO: array
    code: number;
    statusCode: number;
    defaultMessage: string;
    details: unknown;
}
