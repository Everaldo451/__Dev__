import Home from './Routes/Home'
import Login from './Routes/Login'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import './App.css'

export const App = () => {

  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
        </Routes>
    </BrowserRouter>
  )
}

