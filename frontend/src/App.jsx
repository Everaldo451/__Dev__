import { useState, useEffect, createContext } from 'react'
import Home from './Routes/Home'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import axios from "axios"
import './App.css'

export const CSRFContext = createContext(null)
export const HeaderColor = createContext(null)

export const App = () => {
  const [csrf, setCSRF] = useState(null)
  const [hcolor, setHColor] = useState("white")

  useEffect(()=>{
    axios.get("http://localhost:5000/csrf/get",
      {
        withCredentials:true
      })
    .then(response => setCSRF(response.data.csrf))
    .catch(error => console.log(error))
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
    <BrowserRouter>
      <CSRFContext.Provider value={csrf}>
      <HeaderColor.Provider value={hcolor}>
        <Routes>
          <Route path='/' element={<Home/>}/>
        </Routes>
      </HeaderColor.Provider>
      </CSRFContext.Provider>
    </BrowserRouter>
  )
}

