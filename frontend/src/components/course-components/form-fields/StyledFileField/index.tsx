import { useState, useRef } from "react";
import CustomButton from "../../../CustomButton";
import styles from "./index.module.css"

export default function FileInput(
    attrs:React.AllHTMLAttributes<HTMLInputElement>
) {

    const fileInputRef = useRef<HTMLInputElement>(null)
    const [fileValue, setFileValue] = useState("")

    function fileValueChange(e:React.FormEvent<HTMLInputElement>) {
        const regex = /\\\w+\\(.+\.\w+)/
        const value = e.currentTarget.value.match(regex)
        console.log(value)
        setFileValue(value?value[1]:"")
    }

    return (
        <div className={styles.fileDiv}>
            <div>
                <label htmlFor={attrs.id?attrs.id:undefined}>Logo:</label>
                <input type="file" {...attrs} ref={fileInputRef} onInput={fileValueChange}/>
                <CustomButton onClick={(_) => {fileInputRef.current?.click()}}>Upload</CustomButton>
            </div>
            <span>{fileValue}</span>
        </div>
    )

}