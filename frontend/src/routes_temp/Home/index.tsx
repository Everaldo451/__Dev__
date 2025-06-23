import { useContext, useState, useEffect } from "react"
import { UserContext } from "../../contexts/UserContext"
import SearchBar from "../../components/SearchBar"
import AboutText from "../../components/AboutText"
import AboutUsTextChanger from "../../components/AboutUsTextChanger"
import styles from "./index.module.css"
import Computador from "../../assets/computador.webp"

function TextInterval({text}:{text:string}) {

    const [paragraph, setParagraphText] = useState("")
    const [count, setCount] = useState(0)

    useEffect(() => {
        setCount(0)
        setParagraphText("")
    },[text])

    useEffect(()=>{

        const interval = setInterval(()=>{
            if (count < text.length) {
                setParagraphText(paragraph+text[count])
                setCount(count+1)
            } else {clearInterval(interval)}
        },50)

        return () => clearInterval(interval)

    },[count])

    return <p>{paragraph}</p>
}


export default function Home() {

    const [user, _] = useContext(UserContext)

    return (
    <>
        <main className={styles.Home}>
            <section className={styles.introduct}>
                <div className={styles.hello}>
                    {user?
                        <TextInterval text={`Ola, ${user.full_name}, seja bem vindo. Se inscreva para progredir na sua jornada como programador.`}/>
                        :<TextInterval text={"Ola, seja bem vindo. Se inscreva para progredir na sua jornada como programador."}/>
                    }
                    <SearchBar/>

                </div>
                <div className={styles.container}>
                    <img src={Computador} width="100%"></img>
                </div>
            </section>
            <section className={styles.aboutus}>
                <AboutUsTextChanger>
                    <AboutText index={0} title="History">
                        <p>Fundada em 2024, a __Dev foi uma página criada inicialmente 
                        como um simples projeto do Github, para fazer parte de um 
                        portifólio, de forma que o criador conseguisse uma boa vaga
                        de emprego com esse projeto.</p>

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                        distinctio cumque ullam, ut laboriosam amet ab facilis, 
                        ratione odio dolor deleniti. Beatae, libero saepe!</p>

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                        distinctio cumque ullam, ut laboriosam amet ab facilis, 
                        ratione odio dolor deleniti. Beatae, libero saepe!</p>

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                        distinctio cumque ullam, ut laboriosam amet ab facilis, 
                        ratione odio dolor deleniti. Beatae, libero saepe!</p>

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                        distinctio cumque ullam, ut laboriosam amet ab facilis, 
                        ratione odio dolor deleniti. Beatae, libero saepe!</p>
                    </AboutText>
                    <AboutText index={1} title="Objective">
                        <p>O objetivo da __Dev é oferecer os melhores cursos do mercado,
                        com certificado reconhecido internacionalmente, focado em projetos
                        e nas necessidades do mundo real, bem como utilizando as tecnologias
                        mais requisitadas do momento.</p>

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                        distinctio cumque ullam, ut laboriosam amet ab facilis, 
                        ratione odio dolor deleniti. Beatae, libero saepe!</p>

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                        distinctio cumque ullam, ut laboriosam amet ab facilis, 
                        ratione odio dolor deleniti. Beatae, libero saepe!</p>

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                        distinctio cumque ullam, ut laboriosam amet ab facilis, 
                        ratione odio dolor deleniti. Beatae, libero saepe!</p>

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                        distinctio cumque ullam, ut laboriosam amet ab facilis, 
                        ratione odio dolor deleniti. Beatae, libero saepe!</p>
                    </AboutText>
                    <AboutText index={2} title="Quality">
                        <p>A __Dev já é uma instituição reconhecida nacionalmente, 
                        com colaboradores como Lorem Ipsum, e muitos dos usuários 
                        da plataforma mostram diariamente os resultados do treinamento
                        nas redes sociais.</p>

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                        distinctio cumque ullam, ut laboriosam amet ab facilis, 
                        ratione odio dolor deleniti. Beatae, libero saepe!</p>

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                        distinctio cumque ullam, ut laboriosam amet ab facilis, 
                        ratione odio dolor deleniti. Beatae, libero saepe!</p>

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                        distinctio cumque ullam, ut laboriosam amet ab facilis, 
                        ratione odio dolor deleniti. Beatae, libero saepe!</p>

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                        distinctio cumque ullam, ut laboriosam amet ab facilis, 
                        ratione odio dolor deleniti. Beatae, libero saepe!</p>
                    </AboutText>
                </AboutUsTextChanger>
            </section>
        </main>
    </>)
}