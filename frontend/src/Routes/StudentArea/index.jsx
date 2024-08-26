import styles from "./index.module.css"
import SearchResults from "../../Components/SearchResults";
import { User } from "../../main";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

function StudentArea() {

    const user = useContext(User)
    console.log(user.courses)

    return (
        <>
            {user?
                <main className={styles.Area}>
                    <SearchResults courses={user.courses?user.courses:[]}/>
                </main>
            :
                <Navigate to="/"/>
            }
        </>
    )
}

export default StudentArea