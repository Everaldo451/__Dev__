import { useState, useContext } from "react"
import { UserContext } from "../../contexts/UserContext"
import { Navigate } from "react-router-dom"
import SideMenu from "../../components/SideConfigurationMenu"
import style from "./index.module.css"


function ConfigRoute(){

    const [user, _] = useContext(UserContext)
    const [configSection, setConfigSection] = useState<JSX.Element|null>(null)

    return(
        <>
        {user?
            <main className={style.Configs}>
                <section>
                    <SideMenu setConfigSection={setConfigSection} user={user}/>
                    {configSection?configSection:null}
                </section>
            </main>
            : 
            <Navigate to={"/"}/>
            }
        </>
    )

}

export default ConfigRoute