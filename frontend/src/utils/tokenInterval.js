import axios from "axios"

export async function setUserContext(csrf_token, setUser){

    const response = await axios.get("/api/me",undefined,{
        withCredentials: true,
        headers: {
          'X-CSRFToken':csrf_token
        }
    })
    setUser(response.data)
}


export default async function accessTokenInterval(userContext, csrfContext, setLoaded) {

  const [user, setUser] = userContext
  const [csrf_token, setCRSFToken] = csrfContext

  if (user !== null|undefined) {
    setLoaded?setLoaded(true):null
    return
  }

  let errorOcurred = false

  try {
    await setUserContext(csrf_token, setUser)
  } catch(error) {
    errorOcurred = true
  } 
  if (!errorOcurred) {
    setLoaded?setLoaded(true):null
    return
  }

  try {

    await axios.post("/api/auth/refresh",undefined,{
        withCredentials: true,
        headers: {
          'X-CSRFToken':csrf_token
        }
    })
    await setUserContext(csrf_token, setUser)
  
  } catch (error) {}
  setLoaded?setLoaded(true):null
}
  