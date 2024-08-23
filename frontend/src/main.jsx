import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState, createContext, useEffect } from 'react'
import {App} from './App.jsx'
import { GetCookies, GetCookie } from './GetCookies.jsx'
import axios from 'axios'
import './index.css'

export const HeaderColor = createContext(null)
export const CSRFContext = createContext(null)
export const User = createContext(null)

axios.interceptors.request.use(
  config => {
    config.headers['Authorization'] = GetCookie("access",GetCookies()) ? `Bearer ${GetCookie("access",GetCookies())}`:null;
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

async function AccessTokenInterval(user, setUser, interval) {

  if (GetCookie("access",GetCookies())) {
    if (!user) {
      const userdata = await axios.get(
        "http://localhost:5000/auth/getuser",
        {
          withCredentials: true
        }
      )

      setUser(userdata.data.user)
    }
    return
  } else {
    try {

      const accesstoken = await axios.get(
        "http://localhost:5000/auth/gettoken",
        {
          withCredentials: true
        }
      )

      if (GetCookie("access",GetCookies())) {          

        const userdata = await axios.get(
          "http://localhost:5000/auth/getuser",
          {
            withCredentials: true
          }
        )

        setUser(userdata.data.user)

      } else {

        setUser(null)

        clearInterval(interval)
      }

    } catch (error) {

      if (error.response.status == 401){

        setUser(null)

        clearInterval(interval)
      }

    }
  }
  
}

function Main() {

  const [hcolor, setHColor] = useState("white")
  const [csrf, setCSRF] = useState(null)
  const [user,setUser] = useState(null)

  useEffect(()=>{

    axios.get("http://localhost:5000/csrf/get",
      {
        withCredentials:true
      })
    .then(response => {setCSRF(response.data.csrf)})
    .catch(error => console.log(error))
    

    const interv = setInterval(async () => {AccessTokenInterval(user, setUser, interv)}, 1000);

    return () => clearInterval(interv)
  },[user])

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

  return (
    <User.Provider value={user}>
    <HeaderColor.Provider value={hcolor}>
    <CSRFContext.Provider value={csrf}>
      <App/>
    </CSRFContext.Provider>
    </HeaderColor.Provider>
    </User.Provider>
  )

}

export default AccessTokenInterval


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main/>
  </React.StrictMode>,
)