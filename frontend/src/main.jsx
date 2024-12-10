import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import { useState, createContext, useEffect } from 'react'
import { GetCookies } from "./GetCookies.jsx"
import {App} from './App.jsx'
import AccessTokenInterval from './Token.jsx'
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

function Main() {

  const [hcolor, setHColor] = useState("white")
  const [csrf_token, setCSRF] = useState(null)
  const [user,setUser] = useState(null)
  const [loaded,setLoaded] = useState(false)
  const [token, setToken] = useState(null)
  const [count, setCount] = useState(0)

  useEffect(()=>{

    async function fetchData() {

      console.log("hello world")

      try {
        console.log(csrf_token==null)

        if (csrf_token==null) {

          const response = await axios.get("http://localhost:5000/csrf/get",
            {
              withCredentials:true
            }
          )
          setCSRF(response.data.csrf)

          AccessTokenInterval(user, response.data.csrf || csrf_token, setUser, setLoaded)

        }

      } catch(error) {setLoaded(true)}

    }

    fetchData()

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

  if (loaded == true) {

    return (

      <User.Provider value={user}>
        <HeaderColor.Provider value={hcolor}>
          <CSRFContext.Provider value={csrf_token}>
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