import axios, { AxiosInstance } from 'axios';

export class AxiosHelper {
    public static GetAxiosInstance(): AxiosInstance {
        return axios.create({
            baseURL: 'https://api.twitter.com',
        });
    }
}
