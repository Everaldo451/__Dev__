import styles from "./index.module.css"

function Box({text,image,setattr,box}) {

    return (
    <>
    <div className={styles.box} onClick={() => {setattr(box)}}>
        <h3 className={styles.Head}>{text}</h3>
        <img className={styles.Image} src={image}/>
    </div>
    </>
    )
}

export default Box