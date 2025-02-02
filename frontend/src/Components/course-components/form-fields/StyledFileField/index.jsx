import { useState, useRef } from "react";
import CustomButton from "../CustomButton/index"
import styles from "./index.module.css"

export default function FileInput(attrs) {

    const fileInputRef = useRef(null)
    const [fileValue, setFileValue] = useState("")

    function fileValueChange(e) {
        const regex = /\\\w+\\(.+\.\w+)/
        const value = e.currentTarget.value.match(regex)
        console.log(value)
        setFileValue(value?value[1]:"")
    }

    return (
        <div className={styles.fileDiv}>
            <div>
                <label htmlFor={attrs.id?attrs.id:null}>Logo:</label>
                <input type="file" {...attrs} ref={fileInputRef} onInput={fileValueChange}/>
                <CustomButton onClick={(e) => {fileInputRef.current.click()}}>Upload</CustomButton>
            </div>
            <span>{fileValue}</span>
        </div>
    )

}