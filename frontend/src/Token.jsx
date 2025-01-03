import axios from "axios"

async function SetUser(csrf_token, setUser, setCourses){

    const response = await axios.post("http://localhost:5000/jwt/getuser",undefined,{
        withCredentials: true,
        headers: {
          'X-CSRFToken':csrf_token
        }
      }
    )

    const courses = response.data.courses 
    courses.sort((course1, course2) => course2.id - course1.id)

    console.log(courses)
    setCourses(courses)

    delete response.data.courses

    console.log(response.data)
    setUser(response.data)
}


export default async function AccessTokenInterval(userContext, csrfContext, courseContext, setLoaded) {

  const [user, setUser] = userContext
  const [courses, setCourses] = courseContext
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
  
    await SetUser(csrf_token, setUser, setCourses)
  
  } catch (error) {}

  setLoaded?setLoaded(true):null
}
  