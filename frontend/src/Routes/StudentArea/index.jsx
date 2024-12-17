import styles from "./index.module.css"
import SearchResults from "../../Components/SearchResults";
import { User } from "../../MainContexts";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

function StudentArea() {

    const [user, setUser] = useContext(User)
    console.log(user)

    return (
        <>
            {user?
                <main className={styles.Area}>
                    <SearchResults courses={user.courses?user.courses:[]} subscribe={false} area={true}/>
                </main>
            :
                <Navigate to="/"/>
            }
        </>
    )
}

export default StudentArea