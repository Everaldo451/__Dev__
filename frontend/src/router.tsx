import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./routes/Home";
import Login from "./routes/Login";
import CourseSearch from "./routes/CourseSearch";
import UserCoursesArea from "./routes/UserCoursesArea";
import ConfigRoute from "./routes/ConfigRoute";

import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Router() {

    return (
      <BrowserRouter>
          <Header/>
          <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/courses/:name' element={<CourseSearch/>}/>
              <Route path='/configs' element={<ConfigRoute/>}/>
              <Route path='/area' element={<UserCoursesArea/>}/>
          </Routes>
          <Footer/>
      </BrowserRouter>
    )
  }