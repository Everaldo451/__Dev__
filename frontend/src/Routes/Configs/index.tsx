import { useState, useContext, useRef, useEffect, SetStateAction } from "react"
import { UserContext } from "../../contexts/UserContext"
import style from "./index.module.css"
import { Navigate } from "react-router-dom"

interface ConfigProps {
    children: React.ReactNode,
    attrs: React.AllHTMLAttributes<HTMLInputElement>,
    setChange: React.Dispatch<SetStateAction<number>>
}

function Config({children, attrs, setChange}:ConfigProps){

    const [val, setValue] = useState(attrs.value)
    const [Onchange,setChangeState] = useState(false)
    const ref = useRef<HTMLInputElement>(null)

    function onInput(e:React.FormEvent<HTMLInputElement>) {e.preventDefault();setValue(ref.current?.value)}

    useEffect(() => {
        setChange(prev => Onchange==true?prev+1:prev-1>=0?prev-1:prev)
    },[Onchange])

    return (
        <div className={style.Config}>
            <label htmlFor={attrs.name} style={{marginRight:5}}>{children}</label>
            
            <input 
                className={Onchange==false?style.OffChangeInput:undefined}
                {...attrs} 
                required
                id={attrs.name} 
                value={val}
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

                    <h2 style={{margin: 0}}>Dados Pessoais:</h2>

                    <form ref={formRef}>
                        <Config 
                            attrs={{value:user.email, name:"email", type:"email"}} 
                            setChange={setInputs}>Email:
                        </Config>

                        <Config 
                            attrs={{value:user.full_name, name:"full_name", type:"text"}} 
                            setChange={setInputs}>First name:
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