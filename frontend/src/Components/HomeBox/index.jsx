function Box({text,image,setattr,box}) {

    return (
    <>
    <div onClick={() => {setattr(box)}}>
        <h3>{text}</h3>
        <img src={image}/>
    </div>
    </>
    )
}

export default Box