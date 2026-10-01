import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router"
import styles from "./Breadcrumb.module.css"

type Props = {
    title: string
    currentPage: string
}

const Breadcumb = ({ title, currentPage }: Props) => {
    return (
        <div className={styles.breadcumb}>
            <h1 className="title bold">{title}</h1>
            <div className={styles["breadcumb-nav"]}>
                <Link to="/">
                    <FontAwesomeIcon
                        icon={faHome}
                        className={styles["home-icon"]}
                    />
                </Link>
                <span>/</span>
                <span className={styles["breadcumb-current"]}>
                    {currentPage}
                </span>
            </div>
        </div>
    )
}

export default Breadcumb
