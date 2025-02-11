import { createContext, SetStateAction, useState } from "react"
import styles from "./index.module.css"

interface AboutUsTextChangerProps {
    children: React.ReactNode
}

export const CurrentTextIndex = createContext<[number, React.Dispatch<SetStateAction<number>>]>(
    [0, ()=>null]
)

export default function AboutUsTextChanger({children}:AboutUsTextChangerProps) {
    const [textIndex, setTextIndex] = useState<number>(0)

    return (
        <CurrentTextIndex.Provider value={[textIndex, setTextIndex]}>
            <div className={styles.container}>
                <section className={styles.textChanger}>
                    <button onClick={(_) => {setTextIndex(prev => prev-1>=0?prev-1:prev)}}/>
                    <section className={styles.text}>
                        {children}
                    </section>
                    <button onClick={(_) => {setTextIndex(prev => prev+1)}}/>
                </section>
            </div>
        </CurrentTextIndex.Provider>
    )
}