import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import { useState, createContext, useEffect } from 'react'
import {App} from './App.jsx'
import { GetCookies } from './GetCookies.jsx'
import axios from 'axios'
import './index.css'

export const HeaderColor = createContext(null)
export const CSRFContext = createContext(null)
export const User = createContext(null)
export const AccessToken = createContext(null)

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

async function AccessTokenInterval(user, setUser, setLoaded, setToken, csrf) {

  try {
    if (user==null) {

      switch(GetCookies().get("csrf_access_token")) {
        case null || undefined: 

        var token =  await axios.post("http://localhost:5000/jwt/refresh",undefined,{
          withCredentials: true,
          headers: {
            'X-CSRFToken':csrf
          }
        })

        default: 

        var token = await axios.post("http://localhost:5000/jwt/access",undefined,{
          withCredentials: true,
          headers: {
            'X-CSRFToken':csrf
          }
        })

      }

      if (token.data) {

        setToken(token.data)

        const userdata = await axios.get("http://localhost:5000/jwt/getuser",{
          withCredentials: true,
          headers: {
            'Authorization':`Bearer ${token.data}`
          }
        })
        setUser(userdata.data.user)

      } else {
        setUser(null)
      }

    }

  } catch (error) {
    setUser(null)
  }
  setLoaded(true)
}


function Main() {

  const [hcolor, setHColor] = useState("white")
  const [csrf, setCSRF] = useState(null)
  const [user,setUser] = useState(null)
  const [loaded,setLoaded] = useState(false)
  const [token, setToken] = useState(null)
  const [count, setCount] = useState(0)

  useEffect(()=>{

    async function fetchData() {

      try {

        if (csrf==null) {

          var response = await axios.get("http://localhost:5000/csrf/get",
            {
              withCredentials:true
            })
          setCSRF(response.data.csrf)

        }

        AccessTokenInterval(user, setUser, setLoaded, setToken, response.data.csrf || csrf)

      } catch(error) {setLoaded(true)}

    }

    fetchData()

  },[count])

  window.addEventListener("scroll",()=> {

    const header = document.querySelector("header")
    const main = document.querySelector("main")
    const mainsecs = main.querySelectorAll("section")

    for (const section of mainsecs) {

      if (section.getBoundingClientRect()['top'] <= header.clientHeight && section.getBoundingClientRect()['bottom'] >= header.clientHeight) {

        let color = window.getComputedStyle(section,null).getPropertyValue("background-color")
        
        if (color.search("rgba")!=-1) {
          color = color.replace("rgba(","")
        } else {
          color = color.replace("rgb(","")
        }
        color = color.replace(")","")

        const rgb = color.split(",")

        if ((rgb[0]*299 + rgb[1]*587 + rgb[2]*114)/1000 <= 127.5) {
          setHColor("white")
        } else {
          setHColor("black")
        }

        break
      } 
    }
  })

  if (loaded == true) {

    return (

      <User.Provider value={user}>
        <HeaderColor.Provider value={hcolor}>
          <CSRFContext.Provider value={csrf}>
            <AccessToken.Provider value={token}>
              <App/>
            </AccessToken.Provider>
          </CSRFContext.Provider>
        </HeaderColor.Provider>
      </User.Provider>
    )

  } else {return <></>}

}

export default AccessTokenInterval


ReactDOM.createRoot(document.getElementById('root')).render(
  //<React.StrictMode>
    <Main/>
  //</React.StrictMode>,
)