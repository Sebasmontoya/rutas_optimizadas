import { injectable } from 'inversify';
import { AxiosRepository } from '../repositories/AxiosRepository';
import axios, { AxiosResponse } from 'axios';
@injectable()
export class apiServiceAxios implements AxiosRepository {
    async getDataFromUrl(url: string): Promise<AxiosResponse> {
        const response = await axios.get(url);
        return response;
    }
    async postDataToUrl(url: string, data: unknown): Promise<AxiosResponse> {
        const response = await axios.post(url, data);
        return response;
    }
}
