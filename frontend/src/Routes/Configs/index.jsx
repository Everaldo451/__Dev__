import { useState, useContext, useRef, useEffect } from "react"
import { User } from "../../MainContexts"
import style from "./index.module.css"
import { Navigate } from "react-router-dom"

function Config({children, attrs, setChange}){

    const [val, setValue] = useState(attrs.value)
    const [Onchange,setChangeState] = useState(false)
    const ref = useRef(null)

    function onInput(e) {e.preventDefault();setValue(ref.current.value)}

    useEffect(() => {
        setChange(prev => Onchange==true?prev+1:prev-1>=0?prev-1:prev)
    },[Onchange])

    return (
        <div className={style.Config}>
            <label htmlFor={attrs.name} style={{marginRight:5}}>{children}</label>
            
            <input 
                className={Onchange==true?null:style.OffChangeInput}
                {...attrs} 
                required
                id={attrs.name} 
                value={val}
                size={attrs.value.length} 
                ref={ref} 
                onInput={onInput} 
                readOnly={!Onchange}
            />
            
            <button 
                style={{outline:"none",border:"none",backgroundColor:"gray",padding:5}} 
                onClick={(e) => {e.preventDefault();setChangeState(!Onchange)}}
            >
                {Onchange==true?"Save":"Change"}
            </button>
        </div>
    )
}

function Configs(){

    const [user, setUser] = useContext(User)
    const [changingInputs,setInputs] = useState(0)

    const formRef = useRef(null)

    function OnClick(e) {
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

                    <h2 style={{margin: 0}}>Dados Pessoais:</h2>

                    <form ref={formRef}>
                        <Config 
                            attrs={{value:user.email, name:"email", type:"email"}} 
                            setChange={setInputs}>Email:
                        </Config>

                        <Config 
                            attrs={{value:user.first_name, name:"first_name", type:"text"}} 
                            setChange={setInputs}>First name:
                        </Config>

                        <Config 
                            attrs={{value:user.last_name, name:"last_name", type:"text"}} 
                            setChange={setInputs}>Last name:
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