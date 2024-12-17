export const GetCookies = () => {
    
    const cookie_dict = new Map()

    for (const cookie of document.cookie.split(";")) {

        const splited_cookie = cookie.split("=")
        cookie_dict.set(splited_cookie[0].replace(" ",""), splited_cookie[1])
    }

    return cookie_dict
}
