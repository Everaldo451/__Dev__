import { useContext } from "react";
import { User, CSRFContext, Courses } from "../../../MainContexts"
import styles from "./index.module.css"
import axios from "axios";

export default function UnSubscribeButton({course, setCourses}) {

    const [csrf_token, setCSRFToken] = useContext(CSRFContext)
    const [user, setUser] = useContext(User)

    async function onclickIfNotUser(e) {
        e.preventDefault()
        navigate("/login")
    }

    async function onclickIfUserIsStudent(e) {
        e.preventDefault()
        try{

            const response = await axios.delete(`/api/me/courses/${course.id}`,
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken':`${csrf_token}`
                    }
                })

            if (response.status == 200) {
                setCourses(prev => [...prev.filter((value) => value.id != course.id)])
                navigate("/")
            }

        } catch(error) {console.log(error)}
    }

    function onClick() {
        if (!user) {return onclickIfNotUser}
        if (user.user_type == "student") {return onclickIfUserIsStudent}
    }
    return (
        <button className={styles.unSubscribe} onClick={onClick()}>
            <img></img>
        </button>
    )
}