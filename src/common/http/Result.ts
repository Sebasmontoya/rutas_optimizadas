import { Response } from './Response';

export class Result {
    static ok<T>(data?: T): Response<T | null> {
        return {
            response: {
                isError: false,
                data: data || null,
            },
            status: 200,
        };
    }
    static failure<T>(data?: T): Response<T | null> {
        return {
            response: {
                isError: true,
                data: data || null,
            },
            status: 500,
        };
    }
}
