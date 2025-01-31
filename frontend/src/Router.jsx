import Home from './routes/Home'
import Login from './routes/Login'
import CourseSearch from './routes/CourseSearch'
import Configs from './routes/Configs'
import UserCoursesArea from './routes/UserCoursesArea'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Header from './components/Header'
import Footer from './components/Footer'

export const Router = () => {

  return (
    <BrowserRouter>
        <Header/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/courses/:name' element={<CourseSearch/>}/>
            <Route path='/configs' element={<Configs/>}/>
            <Route path='/area' element={<UserCoursesArea/>}/>
        </Routes>
        <Footer/>
    </BrowserRouter>
  )
}