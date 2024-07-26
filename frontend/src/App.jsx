import { useState, useEffect, createContext } from 'react'
import Home from './Routes/Home'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import axios from "axios"
import './App.css'

export const App = () => {

  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
        </Routes>
    </BrowserRouter>
  )
}

