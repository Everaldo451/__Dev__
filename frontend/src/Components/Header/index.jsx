import { useContext } from "react"
import { HeaderColor } from "../../App"
import "./index.css"


function Header() {

    const hcolor = useContext(HeaderColor)
    console.log(hcolor)

    return(
    <header>
        <nav>
            <ul style={{color:HeaderColor}}>
                <li><a>Home</a></li>
                <li><h1>__DEV__</h1></li>
                <li><a>Login</a></li>
            </ul>
        </nav>
    </header>
    )
}

export default Header