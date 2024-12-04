import { useState, useContext } from "react";
import { CSRFContext, User } from "../../main";
import styles from "./index.module.css"
import { Navigate } from "react-router-dom";

function Login(){

    const csrf = useContext(CSRFContext)
    const [action, setAction] = useState("login")
    const [isTeacher, setIsTeacher] = useState(false)
    const user = useContext(User)

    return(
        <>
            {!user?
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
                        <div className={styles.isTeacher}>
                            <input type="checkbox" name="is_teacher" id="is_teacher"/>
                            <label htmlFor="is_teacher">Is teacher</label>
                        </div>
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
            :
            <Navigate to={"/"}/>
            }
        </>
    )
}

export default Login