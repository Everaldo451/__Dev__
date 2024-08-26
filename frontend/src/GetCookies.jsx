export const GetCookies = () => {
    
    const cookie_dict = new Map()

    for (const cookie of document.cookie.split(";")) {

        cookie_dict.set(cookie.split("=")[0].replace(" ",""), cookie.split("=")[1])
    }

    return cookie_dict
}
