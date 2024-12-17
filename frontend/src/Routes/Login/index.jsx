import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CSRFContext, User } from "../../MainContexts";
import { Navigate } from "react-router-dom";
import AccessTokenInterval from "../../Token";
import axios from "axios";
import styles from "./index.module.css"

function Login(){

    const [csrf_token, setCSRFToken] = useContext(CSRFContext)
    const [action, setAction] = useState("login")
    const [user, setUser] = useContext(User)
    const navigate = useNavigate()

    async function onSubmit(e) {
        e.preventDefault()

        const data = new FormData(e.currentTarget)

        try {
            const response = await axios({
                url: e.currentTarget.action,
                method: e.currentTarget.method,
                data: data,
                headers: {
                    'X-CSRFToken': csrf_token?csrf_token:""
                },
                withCredentials: true
            })

            console.log(response.data)

            if (response.status == 200) {
                await AccessTokenInterval([user,setUser], [csrf_token,setCSRFToken])
                navigate('/')
            }
        } catch(e) {
            console.log(e.response.data)
        }

    }

    return(
        <>
            {!user?
            <main className={styles.Login}>
                <section>
                    <ul>
                        <li id="login" onClick={(e) => setAction(e.target.id)}>Login</li>
                        <li id="register" onClick={(e) => {setAction(e.target.id)}}>Registro</li>
                    </ul>

                    
                    <form action={action?`http://localhost:5000/auth/${action}`:""} method="POST" onSubmit={onSubmit}>
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