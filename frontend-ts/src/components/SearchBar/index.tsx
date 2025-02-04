import style from "./index.module.css"
import { useNavigate } from "react-router-dom"

export default function SearchBar() {

    const navigate = useNavigate()

    function onKeyUp(e:React.KeyboardEvent<HTMLInputElement>) {

        if (e.key === "Enter") {
            navigate(`/courses/${e.currentTarget.value}`)
        }
    }

    return (
        <div className={style.SearchBar}>
            <input type="text" name="course" placeholder="Digite um curso" onKeyUp={onKeyUp}/>
        </div>
    )

}