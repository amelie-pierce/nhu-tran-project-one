import { useEffect } from "react"
import {
    Education,
    Introduction,
    Project,
    Scholarship,
    WorkExperience,
} from "./components"

const AboutMe = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
    }, [])

    return (
        <div style={{ width: "100%" }}>
            <Introduction />
            <Education />
            <Scholarship />
            <Project />
            <WorkExperience />
        </div>
    )
}

export default AboutMe
