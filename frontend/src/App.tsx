import { useState, useEffect } from 'react'
import LoadContexts from './LoadContexts'
import Router from './router'
import { UserType } from './types/UserType'
import { CourseType } from './types/CourseType'
import accessTokenInterval from './utils/tokenInterval'
import configureApiRequestInterceptor from './api/getCSRFCookieNames'

export default function App() {

  const [user,setUser] = useState<UserType|null>(null)
  const [courses, setCourses] = useState<Set<CourseType>>(new Set([]))
  const [loaded,setLoaded] = useState(false)

  useEffect(()=>{

    async function fetchData() {
      await configureApiRequestInterceptor()
      try {
        accessTokenInterval([user, setUser], setLoaded)
      } catch(error) {setLoaded(true)}
    }

    fetchData()
  },[])

  if (loaded == true) {

    return (
      <LoadContexts contextValues={{
        user: [user, setUser],
        courses: [courses, setCourses]
      }}>
        <Router/>
      </LoadContexts>
    )

  } else {return <></>}

}