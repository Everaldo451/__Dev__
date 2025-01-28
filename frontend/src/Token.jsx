import axios from "axios"

async function SetUser(csrf_token, setUser, setCourses){

    const response = await axios.get("/api/me",undefined,{
        withCredentials: true,
        headers: {
          'X-CSRFToken':csrf_token
        }
    })
    setUser(response.data)
}


export default async function AccessTokenInterval(userContext, csrfContext, courseContext, setLoaded) {

  const [user, setUser] = userContext
  const [courses, setCourses] = courseContext
  const [csrf_token, setCRSFToken] = csrfContext

  if (user !== null|undefined) {
    setLoaded?setLoaded(true):null
    return
  }

  let errorOcurred = false

  try {
    await SetUser(csrf_token, setUser, setCourses)
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
    await SetUser(csrf_token, setUser, setCourses)
  
  } catch (error) {}
  setLoaded?setLoaded(true):null
}
  