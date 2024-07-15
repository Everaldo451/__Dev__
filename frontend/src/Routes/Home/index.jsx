import { useContext } from "react"
import {CSRFContext} from "../../App"

function Home(props) {

    console.log(CSRFContext)

    const csrf  = useContext(CSRFContext)
    console.log(csrf)

    return (
    <>
        <form action="http://localhost:5000/csrf/post" method="POST">
            <input type="hidden" value={csrf} name="csrf_token"/>
            <input type="submit"/>
        </form>
    </>)
}

export default Home