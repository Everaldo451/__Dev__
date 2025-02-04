import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../contexts/UserContext"
import { CSRFContext } from "../../contexts/CSRFContext"
import styles from "./index.module.css"
import {Link} from "react-router-dom"
import axios from "axios"


function Header() {

    const [user, setUser] = useContext(UserContext)
    const [csrfToken, _] = useContext(CSRFContext)
    const navigate = useNavigate()
    
    async function onclick() {

        try {
            const response = await axios.post("/api/auth/logout",undefined,
                {
                    withCredentials:true,
                    headers: {
                        "X-CSRF-Token":csrfToken
                    }
                })
            if (response.status==204){
                setUser(null)
                navigate("/")
            }
        } catch(error) {
            return
        }
    }

    return(
    <header className={styles.Main}>
        <nav>
            <ul className={styles.header}>
                <li><Link to="/" style={{textDecoration:"none"}}>Home</Link></li>
                <li><h1>__DEV__</h1></li>
                {user?
                <div className={styles.foto}>
                    <div className={styles.img}></div>
                    <ul className={styles.options}>
                        <li><Link to="/configs">Configurações</Link></li>
                        {user.user_type == "student"?
                            <li><Link to="/area">Área do Estudante</Link></li>
                            :user.user_type == "teacher"?
                                <li><Link to="/area">Área do Professor</Link></li>
                                :null
                        }
                        <li><button onClick={(e) => {onclick()}}>Logout</button></li>
                    </ul>
                </div>
                :
                <li><Link to="/login" style={{textDecoration:"none"}}>Login</Link></li>
                }
            </ul>
        </nav>
    </header>
    )
}

export default Header