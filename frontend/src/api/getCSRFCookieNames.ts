import { api, requestInterceptorGenerator, requestRejected } from "./api";

export async function getCSRFCookieNames() {
    try {
        const response = await api.get("/csrf")
        const data = response.data

        if (data instanceof Object) {
            const accessCSRFCookieName = data["access_csrf_cookie_name"]
            const refreshCSRFCookieName = data["refresh_csrf_cookie_name"]

            return [accessCSRFCookieName, refreshCSRFCookieName]
        }
        return []
    } catch (error) {
        return []
    }
}

export default async function configureApiRequestInterceptor() {
    const cookieNames = await getCSRFCookieNames()
    if (cookieNames.length==2) {
        const [accessCSRFCookieName, refreshCSRFCookieName] = cookieNames
        api.interceptors.request.use(
            requestInterceptorGenerator(accessCSRFCookieName, refreshCSRFCookieName),
            requestRejected
        )
    }
}