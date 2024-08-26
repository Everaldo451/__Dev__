import styles from "./index.module.css"
import SearchResults from "../../Components/SearchResults";
import { User, AccessToken } from "../../main";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

function StudentArea() {

    const user = useContext(User)
    const token = useContext(AccessToken)
    console.log(user.courses)

    return (
        <>
            {user?
                <main className={styles.Area}>
                    <SearchResults courses={user.courses?user.courses:[]} token={token} subscribe={false}/>
                </main>
            :
                <Navigate to="/"/>
            }
        </>
    )
}

export default StudentArea