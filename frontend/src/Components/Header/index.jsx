import { useContext } from "react"
import { HeaderColor, User, AccessToken } from "../../main"
import styles from "./index.module.css"
import {Link} from "react-router-dom"
import axios from "axios"

async function onclick(token) {

    try {

        const response = await axios.get("http://localhost:5000/auth/logout",
            {
                withCredentials:true,
                headers: {
                    'Authorization':`Bearer ${token}`
                }
            })


        window.location.assign("/")

    } catch(error) {

        return

    }
}

function Header() {

    const hcolor = useContext(HeaderColor)
    const user = useContext(User)
    const token = useContext(AccessToken)

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
                        <li><button onClick={(e) => {onclick(token)}}>Logout</button></li>
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