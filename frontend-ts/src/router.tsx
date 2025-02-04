import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./routes/Home";
import Login from "./routes/Login";
import CourseSearch from "./routes/CourseSearch";

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
              <Route path='/configs' element={<Configs/>}/>
              <Route path='/area' element={<UserCoursesArea/>}/>
          </Routes>
          <Footer/>
      </BrowserRouter>
    )
  }