import { useContext } from "react"
import { HeaderColor, User } from "../../main"
import styles from "./index.module.css"
import {Link} from "react-router-dom"
import axios from "axios"

async function onclick() {

    try {

        const response = await axios.get("http://localhost:5000/auth/logout",{withCredentials:true})

        
        window.location.assign("/")

    } catch(error) {

        

    }
}

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
                        <li><Link to="/configs">Configurações</Link></li>
                        <li><Link to="/area">Área do Estudante</Link></li>
                        <li><button onClick={onclick}>Logout</button></li>
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