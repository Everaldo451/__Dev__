import { useState, useContext, useRef, useEffect } from "react"
import { User } from "../../main"
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

    const user = useContext(User)
    const [changeInputs,setInputs] = useState(0)

    function OnClick(e) {
        e.preventDefault()
        const form = e.currentTarget.parentElement
       
        changeInputs==0?form.submit():null
    }

    return(
        <>
        {user?
            <main className={style.Configs}>
                <section>

                    <h2 style={{margin: 0}}>Dados Pessoais:</h2>

                    <form>
                        <Config 
                            attrs={{value:user.email, name:"email", type:"email"}} 
                            setChange={setInputs}>Email:
                        </Config>

                        <Config 
                            attrs={{value:user.username, name:"username", type:"text"}} 
                            setChange={setInputs}>Username:
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