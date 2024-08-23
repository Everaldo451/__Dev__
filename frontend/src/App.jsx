import Home from './Routes/Home'
import Login from './Routes/Login'
import CourseRoute from './Routes/CourseRoute'
import Header from './Components/Header'
import Footer from './Components/Footer'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import './App.css'

export const App = () => {

  return (
    <BrowserRouter>
        <Header/>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/courses/:name' element={<CourseRoute/>}/>
          </Routes>
        <Footer/>
    </BrowserRouter>
  )
}

