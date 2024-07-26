import { useContext } from "react"
import { HeaderColor } from "../../main"
import styles from "./index.module.css"
import {Link} from "react-router-dom"


function Header() {

    const hcolor = useContext(HeaderColor)

    return(
    <header className={styles.Main}>
        <nav>
            <ul style={{color:hcolor || "white"}}>
                <li><Link to="/" style={{color:hcolor || "white", textDecoration:"none"}}>Home</Link></li>
                <li><h1>__DEV__</h1></li>
                <li><Link to="/login" style={{color:hcolor || "white", textDecoration:"none"}}>Login</Link></li>
            </ul>
        </nav>
    </header>
    )
}

export default Header