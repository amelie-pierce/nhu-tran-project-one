import {
    Education,
    Introduction,
    Project,
    Scholarship,
    WorkExperience,
} from "./components"

const AboutMe = () => {
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
