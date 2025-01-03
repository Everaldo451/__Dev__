import Home from './Routes/Home'
import Login from './Routes/Login'
import CourseSearch from './Routes/CourseSearch'
import Configs from './Routes/Configs'
import UserCoursesArea from './Routes/UserCoursesArea'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import App from './App'
import './App.css'

export const Router = () => {

  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App/>}>
                <Route index element={<Home/>}/>
                <Route path='login' element={<Login/>}/>
                <Route path='courses/:name' element={<CourseSearch/>}/>
                <Route path='configs' element={<Configs/>}/>
                <Route path='area' element={<UserCoursesArea/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
  )
}