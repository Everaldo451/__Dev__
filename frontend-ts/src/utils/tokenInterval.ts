import { SetStateAction } from "react"
import { UserType } from "../types/UserType"
import { UserContextType } from "../contexts/UserContext"
import { CSRFContextType } from "../contexts/CSRFContext"
import axios from "axios"

export async function setUserContext(
    csrf_token:string|null, 
    setUser:React.Dispatch<SetStateAction<UserType|null>>
){
    const response = await axios.get("/api/me",{
        withCredentials: true,
        headers: {
          'X-CSRFToken':csrf_token
        }
    })
    setUser(response.data)
}


export default async function accessTokenInterval(
    userContext: UserContextType, 
    csrfContext: CSRFContextType, 
    setLoaded: React.Dispatch<SetStateAction<boolean>>
) {

  const [user, setUser] = userContext
  const [csrf_token, _] = csrfContext

  if (user !== null) {
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
  