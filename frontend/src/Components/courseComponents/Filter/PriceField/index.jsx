import { useEffect, useRef, useState } from "react"
import styles from "./index.module.css"

function BallButton({fn, left, maxValue}) {
    const [margin, setMargin] = useState(0)
    const [value, setValue] = useState(left?0:maxValue)
    const ballRef = useRef(null)

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

    function generateEquation() {
        const a = maxValue/(100**2)

        return function secondGrau(x) {
            return a * x**2
        }
    }
    const valueSetter = generateEquation()

    useEffect(() => {
        const parentElement=ballRef.current.parentElement
        const parentWidth=parentElement.clientWidth
        const percent = (margin/parentWidth)*100

        if (left) {setValue(Math.floor(valueSetter(percent)))}
        else {setValue(Math.floor(valueSetter(100-percent)))}
    },[margin])

    return (
        <div 
            ref={ballRef}
            style={left?{marginLeft:margin}:{marginRight:margin}}
            className={styles.coloredBall} 
            onPointerMove={onPointerMove} 
        >
            <div className={styles.value}>{value}</div>
        </div>
    )
}

function PriceSelector({value, setValue}) {
    return (
        <div className={styles.selector}>
            <div className={styles.ball}/>
            <div className={styles.Line}/>
            <div className={styles.ball}/>
            <div className={styles.buttons}>
                <BallButton left={true} maxValue={1000}/>
                <div className={styles.Line}/>
                <BallButton left={false} maxValue={1000}/>
            </div>
        </div>
    )
}

export default function PriceField() {
    const [value, setValue] = useState(new Array(2))

    return (
        <div className={styles.field}>
            <label>Price</label>
            <input type="hidden" name="price" value={value.join(",")}/>
            <PriceSelector value={value} setValue={setValue}/>
        </div>
    )
}