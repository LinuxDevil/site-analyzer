/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import axios, { AxiosInstance } from 'axios';

import HttpClient, { IRequestOption } from './IHttpClient';
import { responseTransformer, errorHandler } from './HttpTransformers';

/**
 * Axios API client
 * @implements HttpClient
 * @see HttpClient
 * @summary It is used to make HTTP requests, it is asynchronous and uses promises.
 * @supported Supported browsers for Axios: https://github.com/axios/axios#browser-support
 */
class Axios implements HttpClient {
    axiosApi: AxiosInstance = axios.create();
    domain = new URL(location.href);
    defaultUrl = `http://localhost:4000/api/v1/`;


    public request<Response>(option: IRequestOption): Promise<Response> {
        const axiosApi: AxiosInstance = axios.create();
        console.log(this.defaultUrl + option.url);

        axiosApi.interceptors.response.use(responseTransformer);
        const headers = {
            ...option.headers
        };

        return axiosApi({
            method: option.method,
            url: this.defaultUrl + option.url,
            data: option.body,
            headers
        })
            .then((response) => <Response>response)
            .catch(errorHandler);
    }
}

export default Axios;