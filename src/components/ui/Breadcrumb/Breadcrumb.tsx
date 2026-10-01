import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router"
import styles from "./Breadcrumb.module.css"

type Props = {
    title: string
    currentPage: string
}

const Breadcrumb = ({ title, currentPage }: Props) => {
    return (
        <div className={`${styles.breadcrumb} section-padding`}>
            <h1 className="title bold">{title}</h1>
            <div className={styles["breadcrumb-nav"]}>
                <Link to="/">
                    <FontAwesomeIcon
                        icon={faHome}
                        className={styles["home-icon"]}
                    />
                </Link>
                <span>/</span>
                <span className={styles["breadcrumb-current"]}>
                    {currentPage}
                </span>
            </div>
        </div>
    )
}

export default Breadcrumb
