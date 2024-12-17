import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { GetCookies } from "./utils/GetCookies.jsx"
import AccessTokenInterval from './Token.jsx'
import LoadContexts from './MainContexts.jsx'
import axios from 'axios'
import Header from './Components/Header/index.jsx'
import Footer from './Components/Footer/index.jsx'

axios.interceptors.request.use(
  config => {
    config.headers['X-CSRF-REFRESH'] = GetCookies().get('csrf_refresh_token')
    config.headers['X-CSRF-ACCESS'] = GetCookies().get('csrf_access_token')
    return config
  },
  error => {
    return Promise.reject(error)
  }
)


export default function App() {

  const [csrf_token, setCSRFToken] = useState(null)
  const [user,setUser] = useState(null)
  const [loaded,setLoaded] = useState(false)

  useEffect(()=>{

    async function fetchData() {
      try {
        console.log(csrf_token==null)

        if (csrf_token==null) {

          const response = await axios.get("/api/csrf/get",
            {
              withCredentials:true
            }
          )

          const token = response.data.csrf
          console.log(token)
          setCSRFToken(token)
          AccessTokenInterval([user, setUser], [token, setCSRFToken], setLoaded)
        }
      } catch(error) {setLoaded(true)}
    }

    fetchData()
  },[])

  if (loaded == true) {

    return (
      <LoadContexts contextValues={{
        csrf_token: [csrf_token, setCSRFToken],
        user: [user, setUser]
      }}>
        <Header/>
        <Outlet/>
        <Footer/>
      </LoadContexts>
    )

  } else {return <></>}

}