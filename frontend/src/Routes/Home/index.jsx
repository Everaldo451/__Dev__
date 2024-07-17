import { useContext, useState, useEffect } from "react"
import {CSRFContext} from "../../App"
import Header from "../../Components/Header"
import Footer from "../../Components/Footer"
import "./index.css"
import Computador from "../../assets/computador.webp"

function Home(props) {

    const input = document.querySelector("input")

    const csrf  = useContext(CSRFContext)

    const [text, setText] = useState("")

    const [count, setCount] = useState(0)

    const theText = "Ola Dev, seja bem vindo. Se inscreva para progredir na sua jornada como programador."


    useEffect(()=>{
        const interval = setInterval(()=>{
            if (count < theText.length) {
                setText(text+theText[count])
                setCount(count+1)
            } else {clearInterval(interval)}
        },50)

        return () => clearInterval(interval)

    },[text,count])

    return (
    <>
        <Header/>
        <main className="Home">
            <section className="introduct">
                <div className="hello">
                    <p>{text}</p>
                    <form>
                        <input type="text" name="course" placeholder="Digite um curso"/>
                    </form>

                </div>
                <div className="container">
                    <img src={Computador} width="100%"></img>
                </div>
            </section>
        </main>

        <form action="http://localhost:5000/csrf/post" method="POST">
            <input type="hidden" value={csrf?csrf:""} name="csrf_token"/>
            <input type="submit"/>
        </form>
        <Footer/>
    </>)
}

export default Home