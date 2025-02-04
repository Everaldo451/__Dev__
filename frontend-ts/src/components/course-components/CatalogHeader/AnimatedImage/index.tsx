import styles from "./index.module.css"

interface LineProps {
    distance: string,
}

type CustomStyle = React.CSSProperties & {
    "--distance":string
}

function Line({distance}:LineProps) {

    const customStyle:CustomStyle = {
        "--distance":distance
    }

    return (
        <div className={styles.Line} style={customStyle}>
            <div className={styles.Ball}/>
        </div>
    )
}

export default function AnimatedImage() {

    return (
        <div className={styles.AnimatedImage}>
            <Line distance={"25%"}/>
            <Line distance={"70%"}/>
            <Line distance={"40%"}/>
        </div>
        
    )

}