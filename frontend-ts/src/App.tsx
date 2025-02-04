import { useState, useEffect } from 'react'
import LoadContexts from './LoadContexts'
import Router from './router'
import { UserType } from './types/UserType'
import { CourseType } from './types/CourseType'
import accessTokenInterval from './utils/tokenInterval'
import axios from 'axios'

export default function App() {

  const [csrf_token, setCSRFToken] = useState<string|null>(null)
  const [user,setUser] = useState<UserType|null>(null)
  const [courses, setCourses] = useState<Set<CourseType>>(new Set([]))
  const [loaded,setLoaded] = useState(false)

  useEffect(()=>{

    async function fetchData() {
      try {
        console.log(csrf_token==null)

        if (!csrf_token) {
          const response = await axios.get("/api/csrf",{withCredentials:true})
          const token = response.data.csrf
          console.log(token)
          setCSRFToken(token)
          accessTokenInterval([user, setUser], [token, setCSRFToken], setLoaded)
        }
      } catch(error) {setLoaded(true)}
    }

    fetchData()
  },[])

  if (loaded == true) {

    return (
      <LoadContexts contextValues={{
        csrf_token: [csrf_token, setCSRFToken],
        user: [user, setUser],
        courses: [courses, setCourses]
      }}>
        <Router/>
      </LoadContexts>
    )

  } else {return <></>}

}