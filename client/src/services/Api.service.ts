import Axios from "../data/Axios";
import { IRequestOption } from "../data/IHttpClient";
import { Nullable } from "../util/types";

/**
 * Api Service
 * Used to work with the Generic Axios class
 * @see Axios
 * @usage Example 1 Example
 * ApiService.Instance.get(url)
 */
export class ApiService {
    static instance: Nullable<ApiService> = null;
    static axiosInstance: Nullable<Axios> = null;

    static get Instance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    static getAxiosInstance(): Axios {
        if (!ApiService.axiosInstance) {
            ApiService.axiosInstance = new Axios();
        }
        return ApiService.axiosInstance;
    }

    /**
     * Get Request
     * @param url
     * @param option
     * @param responseHandler
     */
    public get<Response>(url: string, option?: IRequestOption, responseHandler?: () => never): Promise<Response> {
        try {
            return ApiService.getAxiosInstance()
                .request<Response>({
                    method: 'GET',
                    url,
                    ...option
                })
                .then(responseHandler);
        } catch (error) {
            console.error({ error });
            return Promise.reject(error);
        }
    }

    /**
     * Post Request
     * @param url
     * @param option
     * @param middleResponseHandler
     */
    public post<Response>(url: string, option?: IRequestOption, middleResponseHandler?: () => never): Promise<Response> {
        return ApiService.getAxiosInstance()
            .request<Response>({
                method: 'POST',
                url,
                ...option
            })
            .then(middleResponseHandler);
    }

    /**
     * Patch Request
     * @param url
     * @param option
     * @param middleResponseHandler
     */
    public patch<Response>(url: string, option?: IRequestOption, middleResponseHandler?: () => never): Promise<Response> {
        return ApiService.getAxiosInstance()
            .request<Response>({
                method: 'PATCH',
                url,
                ...option
            })
            .then(middleResponseHandler);
    }

    /**
     * Put Request
     * @param url
     * @param option
     * @param middleResponseHandler
     */
    public put<Response>(url: string, option?: IRequestOption, middleResponseHandler?: () => never): Promise<Response> {
        return ApiService.getAxiosInstance()
            .request<Response>({
                method: 'PUT',
                url,
                ...option
            })
            .then(middleResponseHandler);
    }

    /**
     * Delete Request
     * @param url
     * @param option
     * @param middleResponseHandler
     */
    public delete<Response>(
        url: string,
        option?: IRequestOption,
        middleResponseHandler?: () => never
    ): Promise<Response> {
        return ApiService.getAxiosInstance()
            .request<Response>({
                method: 'DELETE',
                url,
                ...option
            })
            .then(middleResponseHandler);
    }

    public uploadFiles<Response>(
        url: string,
        formData: FormData,
        option?: IRequestOption,
        method: HttpMethodTypes = 'POST',
        middleResponseHandler?: () => never
    ): Promise<Response> {
        return ApiService.getAxiosInstance()
            .request<Response>({
                method: method,
                url,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: formData,
                ...option
            })
            .then(middleResponseHandler);
    }
}

export type HttpMethodTypes = 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH';
