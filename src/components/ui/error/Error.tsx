import styles from "./Error.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faFaceFrownOpen,
    faRotateRight,
} from "@fortawesome/free-solid-svg-icons"
import Button from "../Button/Button"

const Error = () => {
    return (
        <div className={styles["error-container"]}>
            <FontAwesomeIcon
                icon={faFaceFrownOpen}
                className={styles["error-icon"]}
            />
            <div className={styles["error-text"]}>
                <span className="title bold">OOPS</span>
                <span>Sorry, something went wrong there. Please try again</span>
            </div>
            <Button
                icon={<FontAwesomeIcon icon={faRotateRight} />}
                onClick={() => window.location.reload()} // TODO: reload error page, not /error
            >
                Try again
            </Button>
        </div>
    )
}

export default Error
