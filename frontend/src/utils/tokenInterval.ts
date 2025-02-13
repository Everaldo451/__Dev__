import { SetStateAction } from "react"
import { UserType } from "../types/UserType"
import { UserContextType } from "../contexts/UserContext"
import { api } from "../api/api"

export async function setUserContext(
    setUser:React.Dispatch<SetStateAction<UserType|null>>
){
    const response = await api.get("/me",{
        withCredentials: true,
    })
    setUser(response.data)
}


export default async function accessTokenInterval(
    userContext: UserContextType, 
    setLoaded: React.Dispatch<SetStateAction<boolean>>
) {

  const [user, setUser] = userContext

  if (user !== null) {
    setLoaded?setLoaded(true):null
    return
  }

  let errorOcurred = false

  try {
    await setUserContext(setUser)
  } catch(error) {
    errorOcurred = true
  } 
  if (!errorOcurred) {
    setLoaded?setLoaded(true):null
    return
  }

  try {

    await api.post("/auth/refresh",undefined,{
        withCredentials: true,
    })
    await setUserContext(setUser)
  
  } catch (error) {}
  setLoaded?setLoaded(true):null
}
  