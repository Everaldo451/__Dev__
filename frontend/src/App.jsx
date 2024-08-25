import Home from './Routes/Home'
import Login from './Routes/Login'
import CourseRoute from './Routes/CourseRoute'
import Configs from './Routes/Configs'
import StudentArea from './Routes/StudentArea'
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
            <Route path='/configs' element={<Configs/>}/>
            <Route path='/area' element={<StudentArea/>}/>
          </Routes>
        <Footer/>
    </BrowserRouter>
  )
}

