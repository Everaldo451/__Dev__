import { useEffect, useRef, useState } from "react"
import styles from "./index.module.css"

function BallButton({setInputValue, left, maxValue}) {
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

        if (left) {
            const value=Math.floor(valueSetter(percent))
            setValue(value)
            setInputValue(prev => [value, prev[1]])
        }
        else {
            const value=Math.floor(valueSetter(100-percent))
            setValue(value)
            setInputValue(prev => [prev[0],value])
        }
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



function PriceSelector({inputValue, setInputValue}) {
    return (
        <div className={styles.selector}>
            <div className={styles.ball}/>
            <div className={styles.Line}/>
            <div className={styles.ball}/>
            <div className={styles.buttons}>
                <BallButton left={true} maxValue={1000} setInputValue={setInputValue}/>
                <div className={styles.Line}/>
                <BallButton left={false} maxValue={1000} setInputValue={setInputValue}/>
            </div>
        </div>
    )
}



export default function PriceField({setFilterSwitchs}) {
    const [value, setValue] = useState(new Array(2))

    useEffect(() => {
        setFilterSwitchs(prev => ({...prev, 
            "price": {
                "function": (courseKeyValue, filterValue) => {
                    const regex=/(\d+),(\d+)/
                    const [min, max] = regex.exec(filterValue).splice(1)
                    return courseKeyValue>=min && courseKeyValue<=max
                },
                "defaultValue":"0,1000"
            }
        }))
    },[])

    return (
        <div className={styles.field}>
            <label>Price</label>
            <input type="hidden" name="price" value={value.join(",")}/>
            <PriceSelector inputValue={value} setInputValue={setValue}/>
        </div>
    )
}