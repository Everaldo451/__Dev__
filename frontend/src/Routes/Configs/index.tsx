import { useState, useContext, useRef } from "react"
import { UserContext } from "../../contexts/UserContext"
import { Navigate } from "react-router-dom"
import Config from "./Config"
import style from "./index.module.css"


function Configs(){

    const [user, _] = useContext(UserContext)
    const [changingInputs,setInputs] = useState(0)

    const formRef = useRef<HTMLFormElement>(null)

    function OnClick(e:React.MouseEvent<HTMLInputElement>) {
        e.preventDefault()

        if (formRef.current) {
            changingInputs==0?formRef.current.submit():null
        }
    }

    return(
        <>
        {user?
            <main className={style.Configs}>
                <section>

                    <h2 style={{margin: 0}}>Personal Data</h2>

                    <form ref={formRef}>
                        <Config 
                            attrs={{value:user.email, name:"email", type:"email"}} 
                            setChange={setInputs}>Email
                        </Config>

                        <Config 
                            attrs={{value:user.full_name, name:"full_name", type:"text"}} 
                            setChange={setInputs}>First name
                        </Config>

                        <input type="submit" value="Enviar" style={{marginTop:20}} onClick={OnClick}/>
                    </form>

                </section>
            </main>
            : 
            <Navigate to={"/"}/>
            }
        </>
    )

}

export default Configs