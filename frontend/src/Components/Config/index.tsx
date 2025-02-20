import { useRef, useState } from "react"
import styles from "./index.module.css"

export interface ConfigProps {
    children: React.ReactNode,
    attrs: React.AllHTMLAttributes<HTMLInputElement>,
}

export default function Config({children, attrs}:ConfigProps){

    const [val, setValue] = useState(attrs.value)
    const [Onchange,setChangeState] = useState(false)
    const ref = useRef<HTMLInputElement>(null)

    function onInput(e:React.FormEvent<HTMLInputElement>) {e.preventDefault();setValue(ref.current?.value)}

    return (
        <div className={styles.Config}>
            <div className={styles.InputContainer}>
                <label htmlFor={attrs.name} style={{marginRight:5}}>{children?.toString().toUpperCase()}</label>
            
                <input 
                    className={Onchange==false?styles.OffChangeInput:undefined}
                    {...attrs} 
                    required
                    id={attrs.name} 
                    value={val}
                    ref={ref} 
                    onInput={onInput} 
                    readOnly={!Onchange}
                />
            </div>
            
            <button 
                style={{outline:"none",border:"none",backgroundColor:"gray",padding:5}} 
                onClick={(e) => {e.preventDefault();setChangeState(!Onchange)}}
            >
                {Onchange==true?"Save":"Change"}
            </button>
        </div>
    )
}