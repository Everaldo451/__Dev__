import { useEffect, useRef, useState, SetStateAction } from "react"
import styles from "./index.module.css"

interface ConfigProps {
    children: React.ReactNode,
    attrs: React.AllHTMLAttributes<HTMLInputElement>,
    setChange: React.Dispatch<SetStateAction<number>>
}

export default function Config({children, attrs, setChange}:ConfigProps){

    const [val, setValue] = useState(attrs.value)
    const [Onchange,setChangeState] = useState(false)
    const ref = useRef<HTMLInputElement>(null)

    function onInput(e:React.FormEvent<HTMLInputElement>) {e.preventDefault();setValue(ref.current?.value)}

    useEffect(() => {
        setChange(prev => Onchange==true?prev+1:prev-1>=0?prev-1:prev)
    },[Onchange])

    return (
        <div className={styles.Config}>
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
            
            <button 
                style={{outline:"none",border:"none",backgroundColor:"gray",padding:5}} 
                onClick={(e) => {e.preventDefault();setChangeState(!Onchange)}}
            >
                {Onchange==true?"Save":"Change"}
            </button>
        </div>
    )
}