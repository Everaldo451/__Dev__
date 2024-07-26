import { useState, useContext } from "react";
import { CSRFContext } from "../../main";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import styles from "./index.module.css"

function Login(){

    const csrf = useContext(CSRFContext)
    const [action, setAction] = useState("login")

    return(
        <>
        <Header/>
            <main className={styles.Login}>
                <section>
                    <ul>
                        <li id="login" onClick={(e) => setAction(e.target.id)}>Login</li>
                        <li id="register" onClick={(e) => {setAction(e.target.id)}}>Registro</li>
                    </ul>

                    
                    <form action={action?`http://localhost:5000/auth/${action}`:""} method="POST">
                        <input type="hidden" name="csrf_token" value={csrf?csrf:""}/>
                        {action == "register"?
                        <>
                        <input type="text" name="username" placeholder="Digite um nome de usuário" required/>
                        <input type="email" name="email" placeholder="Digite um email" required/>
                        <input type="password" name="password" placeholder="Digite uma senha" required/>
                        </>
                        : 
                        <>
                        <input type="email" name="email" placeholder="Digite seu email" required/>
                        <input type="password" name="password" placeholder="Digite sua senha" required/>
                        </>
                        }
                        <input type="submit"/>
                    </form>
                    
                </section>
            </main>
        <Footer/>
        </>
    )
}

export default Login