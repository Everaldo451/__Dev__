import React from 'react'
import { useState, createContext, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import {App} from './App.jsx'
import { GetCookies, GetCookie } from './GetCookies.jsx'
import './index.css'

export const HeaderColor = createContext(null)
export const CSRFContext = createContext(null)
export const User = createContext(null)

function FormErrorFunction (e) {
  e.preventDefault()
  console.log(e.error, e.message)
}

function Main() {

  axios.interceptors.request.use(
    config => {
      config.headers['Authorization'] = `Bearer ${GetCookie("access",GetCookies())}`;
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

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

    axios.get("http://localhost:5000/auth/getuser",
      {
        withCredentials:true
      })
    .then(response => {setUser(response.data.user)})
    .catch(error => {
      if (error.response.status == 401){
        switch (error.response.data.code) {
          case 1: window.location.reload();
          case 2: return null
        }
      }
    })
  },[])

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

export default FormErrorFunction

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main/>
  </React.StrictMode>,
)