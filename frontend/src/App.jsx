import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"

function App() {
  const [count, setCount] = useState(0)
  const [csrf, setCSRF] = useState(null)

  axios.get("http://localhost:5000/csrf/get")
  .then(response => setCSRF(response.data.csrf))
  .catch(error => console.log(error))

  return (
    <>
      <form action='http://localhost:5000/csrf/post' method='POST'>
        <input type='text' name='text'/>
        <input type="hidden" name='csrf_token' value={csrf?csrf:"none"}/>
        <input type='submit'/>
      </form>
    </>
  )
}

export default App
