import { useContext, useState, useEffect, ReactElement } from "react"
import { UserContext } from "../../contexts/UserContext"
import SearchBar from "../../components/SearchBar"
import Box from "../../components/HomeBox"
import styles from "./index.module.css"
import Computador from "../../assets/computador.webp"
import History from "../../assets/historia.png"
import Objective from "../../assets/alvo.png"
import Quality from "../../assets/verificar.png"

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

function Home() {

    const [user, _] = useContext(UserContext)
    const [box, setBox] = useState<string|null>(null)

    const boxies:{
        [key:string]:{
            data: ReactElement
        }
    } = {
        "history":{
            "data":
            <>
                <p>Fundada em 2024, a __Dev foi uma página criada inicialmente 
                    como um simples projeto do Github, para fazer parte de um 
                    portifólio, de forma que o criador conseguisse uma boa vaga
                    de emprego com esse projeto.
                </p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                    distinctio cumque ullam, ut laboriosam amet ab facilis, 
                    ratione odio dolor deleniti. Beatae, libero saepe!</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                    distinctio cumque ullam, ut laboriosam amet ab facilis, 
                    ratione odio dolor deleniti. Beatae, libero saepe!</p>
            </>
        },
        "objective":{
            "data":
            <>
                <p>O objetivo da __Dev é oferecer os melhores cursos do mercado,
                    com certificado reconhecido internacionalmente, focado em projetos
                    e nas necessidades do mundo real, bem como utilizando as tecnologias
                    mais requisitadas do momento.
                </p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                    distinctio cumque ullam, ut laboriosam amet ab facilis, 
                    ratione odio dolor deleniti. Beatae, libero saepe!</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                    distinctio cumque ullam, ut laboriosam amet ab facilis, 
                    ratione odio dolor deleniti. Beatae, libero saepe!</p>
            </>
        },
        "quality":{
            "data":
            <>
                <p>A __Dev já é uma instituição reconhecida nacionalmente, 
                    com colaboradores como Lorem Ipsum, ..., e muitos dos usuários 
                    da plataforma mostram diariamente os resultados do treinamento
                    nas redes sociais.
                </p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                    distinctio cumque ullam, ut laboriosam amet ab facilis, 
                    ratione odio dolor deleniti. Beatae, libero saepe!</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Esse, soluta. Necessitatibus corrupti exercitationem beatae illum, 
                    distinctio cumque ullam, ut laboriosam amet ab facilis, 
                    ratione odio dolor deleniti. Beatae, libero saepe!</p>
            </>
        }
    }

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
                <h2>Sobre nós</h2>
                <section className={styles.topics}>
                    <div className={styles.grid}>
                        <Box text='Historia' image={History} setattr={setBox} box="history"/>
                        <Box text="Qualidade" image={Quality} setattr={setBox} box="quality"/>
                        <Box text="Objetivo" image={Objective} setattr={setBox} box="objective"/>
                    </div>
                </section>
                {box?
                <section className={styles.text}>
                        {boxies[box]?boxies[box]["data"]:null}
                </section>
                : null}
            </section>
        </main>
    </>)
}

export default Home