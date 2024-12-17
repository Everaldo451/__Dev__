import Home from './Routes/Home'
import Login from './Routes/Login'
import CourseRoute from './Routes/CourseRoute'
import Configs from './Routes/Configs'
import StudentArea from './Routes/StudentArea'
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
                <Route path='courses/:name' element={<CourseRoute/>}/>
                <Route path='configs' element={<Configs/>}/>
                <Route path='area' element={<StudentArea/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
  )
}