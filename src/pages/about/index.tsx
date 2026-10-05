import styles from "./About.module.css"
import Education from "./components/Education/Education"
import Introduction from "./components/Introduction/Introduction"
import Project from "./components/Project/Project"
import Scholarship from "./components/Scholarship/Scholarship"
import WorkExperience from "./components/WorkExperience/WorkExperience"

const AboutMe = () => {
    return (
        <div className={styles["wrapper"]}>
            <Introduction />
            <Education />
            <Scholarship />
            <Project />
            <WorkExperience />
        </div>
    )
}

export default AboutMe
