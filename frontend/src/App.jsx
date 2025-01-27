import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import AccessTokenInterval from './Token.jsx'
import LoadContexts from './MainContexts.jsx'
import axios from 'axios'
import Header from './Components/Header/index.jsx'
import Footer from './Components/Footer/index.jsx'

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
          AccessTokenInterval([user, setUser], [token, setCSRFToken], [courses, setCourses], setLoaded)
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
        <Header/>
        <Outlet/>
        <Footer/>
      </LoadContexts>
    )

  } else {return <></>}

}