import { SetStateAction, useEffect, useRef, useState } from "react"
import { FilterType } from ".."
import styles from "./index.module.css"

interface PriceSelectorProps {
    inputValue: [number, number],
    setInputValue: React.Dispatch<SetStateAction<[number, number]>>
}

interface BallButtonProps {
    setInputValue: PriceSelectorProps["setInputValue"],
    left: boolean,
    maxValue: number
}

function BallButton({setInputValue, left, maxValue}:BallButtonProps) {
    const [margin, setMargin] = useState(0)
    const [value, setValue] = useState(left?0:maxValue)
    const ballRef = useRef<HTMLDivElement>(null)

    let onPointerMove = (e:React.PointerEvent<HTMLDivElement>) => {}
    if (left) {
        onPointerMove = (e) => {
            const parent = e.currentTarget.parentElement
            if (!parent) {return}
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
            if (!parent) {return}
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

        return function secondGrau(x:number) {
            return a * x**2
        }
    }
    const valueSetter = generateEquation()

    useEffect(() => {
        const parentElement=ballRef.current?.parentElement
        if (!parentElement) {return}
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



function PriceSelector({inputValue, setInputValue}:PriceSelectorProps) {
    return (
        <div className={styles.selector}>
            <div className={styles.ball}/>
            <div className={styles.Line}/>
            <div className={styles.ball}/>
            <div className={styles.buttons}>
                <BallButton left={true} maxValue={inputValue[1]} setInputValue={setInputValue}/>
                <div className={styles.Line}/>
                <BallButton left={false} maxValue={inputValue[1]} setInputValue={setInputValue}/>
            </div>
        </div>
    )
}



export default function PriceField(
    {setFilterSwitchs}:{setFilterSwitchs:React.Dispatch<SetStateAction<{[key:string]:FilterType}>>}
) {
    const [minValue, maxValue] = [0, 1000]
    const [value, setValue] = useState<[number, number]>([minValue, maxValue])

    useEffect(() => {
        setFilterSwitchs(prev => ({...prev, 
            "price": {
                "function": (courseKeyValue, filterValue) => {
                    if (typeof filterValue != "string") {return false}

                    const regex=/(\d+),(\d+)/
                    const result=regex.exec(filterValue)
                    if (result===null) {return false}

                    const [minString, maxString] = result.splice(1)
                    const [min, max] = [Number(minString), Number(maxString)]
                    const price = Number(courseKeyValue)
                    console.log(price, min, max, price>=min && price<=max)
                    return price>=min && price<=max
                },
                "defaultValue":"0,1000"
            }
        }))
    },[])

    return (
        <div className={styles.field}>
            <label>Price</label>
            <input type="hidden" name="price" value={value.join(",")}/>
            <PriceSelector inputValue={[minValue, maxValue]} setInputValue={setValue}/>
        </div>
    )
}