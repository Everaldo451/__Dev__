import { useState, createContext } from 'react'
import Home from './Routes/Home'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import axios from "axios"
import './App.css'

export const CSRFContext = createContext(null)

export const App = () => {
  const [csrf, setCSRF] = useState(null)


  axios.get("http://localhost:5000/csrf/get",
    {
      withCredentials:true
    })
  .then(response => setCSRF(response.data.csrf))
  .catch(error => console.log(error))

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

