import { useContext } from "react"
import { HeaderColor, User } from "../../main"
import styles from "./index.module.css"
import {Link} from "react-router-dom"


function Header() {

    const hcolor = useContext(HeaderColor)
    const user = useContext(User)

    return(
    <header className={styles.Main}>
        <nav>
            <ul style={{color:hcolor || "white"}} className={styles.header}>
                <li><Link to="/" style={{color:hcolor || "white", textDecoration:"none"}}>Home</Link></li>
                <li><h1>__DEV__</h1></li>
                {user?
                <div className={styles.foto}>
                    <div className={styles.img} style={user.foto?{backgroundImage:user.foto}:{backgroundColor:hcolor}}></div>
                    <ul className={styles.options} style={hcolor=="white"?{backgroundColor:"black"}:{backgroundColor:"grey"}}>
                        <li><Link to="/configs">Config</Link></li>
                        <li><a href="http://localhost:5000/auth/logout">Logout</a></li>
                    </ul>
                </div>
                :
                <li><Link to="/login" style={{color:hcolor || "white", textDecoration:"none"}}>Login</Link></li>
                }
            </ul>
        </nav>
    </header>
    )
}

export default Header