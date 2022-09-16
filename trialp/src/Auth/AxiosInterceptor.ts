import axios, { AxiosRequestConfig } from 'axios';
import { getAccessToken } from './AccessToken';
axios.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
        const token = getAccessToken();
        if (config.headers === undefined) {
            config.headers = {};
        }
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    }
);