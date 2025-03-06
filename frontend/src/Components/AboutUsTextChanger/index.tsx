import { createContext, SetStateAction, useState } from "react"
import Button from "./Button"
import styles from "./index.module.css"

interface AboutUsTextChangerProps {
    children: React.ReactNode
}

export const CurrentTextIndex = createContext<[number, React.Dispatch<SetStateAction<number>>]>(
    [0, ()=>null]
)
export const CurrentTitle = createContext<[string, React.Dispatch<SetStateAction<string>>]>(
    ["", ()=>null]
)

export default function AboutUsTextChanger({children}:AboutUsTextChangerProps) {
    const [textIndex, setTextIndex] = useState<number>(0)
    const [title, setTitle] = useState<string>("")

    return (
        <CurrentTitle.Provider value={[title, setTitle]}>
            <CurrentTextIndex.Provider value={[textIndex, setTextIndex]}>
                <div className={styles.container}>
                    <section className={styles.content}>
                        <header className={styles.header}>
                            <Button attrs={
                                {onClick: (_) => {setTextIndex(prev => prev-1>=0?prev-1:prev)}}
                            }/>
                            <h3 className={styles.title}>{`Our ${title}`}</h3>
                            <Button attrs={
                                {
                                    onClick: (_) => {setTextIndex(prev => prev+1)},
                                    className: styles.rightButton
                                }
                            }/>
                        </header>
                        <section className={styles.text}>
                            {children}
                        </section>
                    </section>
                </div>
            </CurrentTextIndex.Provider>
        </CurrentTitle.Provider>
    )
}