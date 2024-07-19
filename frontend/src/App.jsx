import { useState, useEffect, createContext } from 'react'
import Home from './Routes/Home'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import axios from "axios"
import './App.css'

export const CSRFContext = createContext(null)
export const HeaderColor = createContext(null)

export const App = () => {
  const [csrf, setCSRF] = useState(null)

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
        let color = section.style.backgroundColor
        console.log(window.getComputedStyle(section))


        break
      } 
    }
  })


  return (
    <BrowserRouter>
      <CSRFContext.Provider value={csrf}>
        <Routes>
          <Route path='/' element={<Home/>}/>
        </Routes>
      </CSRFContext.Provider>
    </BrowserRouter>
  )
}

