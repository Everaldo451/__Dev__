import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { CSRFContext } from "../../contexts/CSRFContext";
import { Navigate } from "react-router-dom";
import { setUserContext } from "../../utils/tokenInterval";
import axios, { AxiosError } from "axios";
import styles from "./index.module.css"

function Login(){

    const [user, setUser] = useContext(UserContext)
    const [csrf_token, setCSRFToken] = useContext(CSRFContext)
    const [action, setAction] = useState("/auth/signin")
    const [errorMessage, setErrorMessage] = useState(null)
    const navigate = useNavigate()

    async function onSubmit(e:React.FormEvent<HTMLFormElement>) {
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
                await setUserContext(csrf_token, setUser)
                navigate("/")
            }
        } catch(error) {
            if (error instanceof AxiosError) {
                const errorData = error.response?.data

                errorData["message"]?setErrorMessage(errorData["message"]):null
            }
        }

    }

    if (user) {return <Navigate to={"/"}/>}

    return (
        <main className={styles.Login}>
            <section>
                <ul>
                    <li id="signin" onClick={(e) => setAction("auth/signin")}>Sign in</li>
                    <li id="register" onClick={(e) => {setAction("users")}}>Sign up</li>
                </ul>

                    
                <form action={action?`/api/${action}`:""} method="POST" onSubmit={onSubmit}>
                    {action == "users"?
                    <>
                        <input type="text" name="full_name" placeholder="Digite seu nome completo" required/>
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
                    {errorMessage?
                        <p className={styles.errorMessage}>{errorMessage}</p>
                        :null
                    }
                    <input type="submit"/>
                </form>
                    
            </section>
        </main>
    )
}

export default Login