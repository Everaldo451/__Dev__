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
                        <li>Login</li>
                        <li>Registro</li>
                    </ul>

                    
                    <form action={action?`http://localhost:5000/auth/${action}`:""} method="POST">
                        <input type="hidden" name="csrf_token" value={csrf?csrf:""}/>
                        {action == "register"?
                        <input type="text" name="username"/>
                        : null
                        }
                        <input type="email" name="email"/>
                        <input type="password" name="password"/>
                        <input type="submit"/>
                    </form>
                    
                </section>
            </main>
        <Footer/>
        </>
    )
}

export default Login