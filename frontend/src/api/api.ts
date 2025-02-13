import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getCookies } from "../utils/getCookies";

export const api = axios.create({
    baseURL: "/api",
})

export function requestInterceptorGenerator(accessCSRFCookieName:string, refreshCSRFCookieName:string) {

    return function requestInterceptor(config:InternalAxiosRequestConfig<any>) {
        const cookies = getCookies()
        const access_csrf_token = cookies.get(accessCSRFCookieName)
        const refresh_csrf_token = cookies.get(refreshCSRFCookieName)

        config.headers["X-CSRF-TOKEN"] = access_csrf_token?access_csrf_token:refresh_csrf_token||undefined

        return config
    }
}

export function requestRejected(error:any):any|null {
    return Promise.reject(error)
}

function responseInterceptor(response:AxiosResponse<any, any>) {
    if (response.status==401) {}

    return response
}

function responseRejected(error:any):any|null {
    return Promise.reject(error)
}

api.interceptors.response.use(responseInterceptor, responseRejected)