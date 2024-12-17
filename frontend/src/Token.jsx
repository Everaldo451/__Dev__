import axios from "axios"

async function SetUser(csrf_token, setUser){

    const response = await axios.post("http://localhost:5000/jwt/getuser",undefined,{
        withCredentials: true,
        headers: {
          'X-CSRFToken':csrf_token
        }
      }
    )
    
    console.log(response.data)
    setUser(response.data)
}


export default async function AccessTokenInterval(userContext, csrfContext, setLoaded) {

  const [user, setUser] = userContext
  const [csrf_token, setCRSFToken] = csrfContext

  if (user != null|undefined) {
    console.log(typeof(user), user)
    setLoaded?setLoaded(true):null
    return
  }

  let errorOcurred = false

  try {
    await SetUser(csrf_token, setUser)
  } catch(error) {
    errorOcurred = true
  } finally {
    if (!errorOcurred) {
      setLoaded?setLoaded(true):null
      return
    }
  }

  try {
  
    await axios.post("http://localhost:5000/jwt/refresh_token",undefined,{
        withCredentials: true,
        headers: {
          'X-CSRFToken':csrf_token
        }
    })
  
    await SetUser(csrf_token, setUser)
  
  } catch (error) {}

  setLoaded?setLoaded(true):null
}
  