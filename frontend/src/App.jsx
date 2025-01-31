import React, { useState, useEffect } from 'react'
import { Router } from './Router.jsx'
import accessTokenInterval from './utils/tokenInterval.js'
import LoadContexts from './contexts/mainContexts.jsx'
import axios from 'axios'

export default function App() {

  const [csrf_token, setCSRFToken] = useState(null)
  const [user,setUser] = useState(null)
  const [courses, setCourses] = useState(new Set([]))
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