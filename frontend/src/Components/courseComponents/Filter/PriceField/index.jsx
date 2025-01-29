import { useState } from "react"
import styles from "./index.module.css"

function BallButton({fn, left}) {
    const [margin, setMargin] = useState(0)

    let onPointerMove = (e) => {}
    if (left) {
        onPointerMove = (e) => {
            const parent = e.currentTarget.parentElement
            const parentRect = parent.getBoundingClientRect()

            setMargin(
                e.clientX>parentRect.left?
                    e.clientX-parentRect.left-e.currentTarget.clientWidth/2
                    :0
            )
        }
    } else {
        onPointerMove = (e) => {
            const parent = e.currentTarget.parentElement
            const parentRect = parent.getBoundingClientRect()

            setMargin(
                e.clientX<parentRect.right?
                    parentRect.right-e.clientX-e.currentTarget.clientWidth/2
                    :0
            )
        }
    }

    return (
        <div 
            style={left?{marginLeft:margin}:{marginRight:margin}}
            className={styles.coloredBall} 
            onPointerMove={onPointerMove} 
        />
    )
}

function PriceSelector({value, setValue}) {
    return (
        <div className={styles.selector}>
            <div className={styles.ball}/>
            <div className={styles.Line}/>
            <div className={styles.ball}/>
            <div className={styles.buttons}>
                <BallButton left={true}/>
                <div className={styles.Line}/>
                <BallButton left={false}/>
            </div>
        </div>
    )
}

export default function PriceField() {
    const [value, setValue] = useState(new Array(2))

    return (
        <div className={styles.field}>
            <label>Price</label>
            <input type="hidden" value={value.join(",")}/>
            <PriceSelector value={value} setValue={setValue}/>
        </div>
    )
}