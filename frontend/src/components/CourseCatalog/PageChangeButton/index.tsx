import { SetStateAction } from "react";
import styles from "./index.module.css"

interface PageChangerProps {
    setPage: React.Dispatch<SetStateAction<number>>,
    reduce: boolean,
    children: React.ReactNode
}

export default function PageChangeButton({setPage, reduce, children}:PageChangerProps) {
    let onClick;

    if (reduce) {
        onClick = (_:React.MouseEvent<HTMLButtonElement>) => {setPage(prev => prev-1>0?prev-1:prev)}
    } else {
        onClick = (_:React.MouseEvent<HTMLButtonElement>) => {setPage(prev => prev+1)}
    }
    return <button className={styles.Button} onClick={onClick}>{children}</button>
}