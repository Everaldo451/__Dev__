import axios from "axios"

async function SetUser(csrf, setUser){

    const response = await axios.post("http://localhost:5000/jwt/getuser",undefined,{
        withCredentials: true,
        headers: {
          'X-CSRFToken':csrf
        }
      }
    )
    
    console.log(response.data)
    setUser(response.data)
}


export default async function AccessTokenInterval(user, csrf, setUser, setLoaded) {

    if (user != null|undefined) {
      console.log(typeof(user), user)
      setLoaded(true)
      return
    }

    let errorOcurred = false

    try {
      await SetUser(csrf, setUser)
    } catch(error) {
      errorOcurred = true
    } finally {
      if (!errorOcurred) {
        setLoaded(true)
        return
      }
    }

    try {
  
        await axios.post("http://localhost:5000/jwt/refresh_token",undefined,{
            withCredentials: true,
            headers: {
              'X-CSRFToken':csrf
            }
        })
  
        await SetUser(csrf, setUser)
  
    } catch (error) {}

    setLoaded(true)
  }
  