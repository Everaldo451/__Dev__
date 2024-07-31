export const GetCookies = () => {
    
    const cookie_dict = {}

    for (const cookie of document.cookie.split(";")) {

        cookie_dict[cookie.split("=")[0]] = cookie.split("=")[1]
    }

    return cookie_dict
}

export const GetCookie = (ckname,cookie_dict) => {

  if (typeof(cookie_dict) === "object") {
    return cookie_dict[String(ckname)]
  } else return null

}