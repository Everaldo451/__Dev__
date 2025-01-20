import style from "./index.module.css"
import { useNavigate } from "react-router-dom"

function SearchBar() {

    const navigate = useNavigate()

    function onKeyUp(e) {

        if (e.key === "Enter") {
            navigate(`/courses/${e.target.value}`)
        }
    }

    return (
        <div className={style.SearchBar}>
            <input type="text" name="course" placeholder="Digite um curso" onKeyUp={onKeyUp}/>
        </div>
    )

}

export default SearchBar