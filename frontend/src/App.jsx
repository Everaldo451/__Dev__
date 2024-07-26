import Home from './Routes/Home'
import {BrowserRouter, Route, Routes} from "react-router-dom"
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

