import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faGamepad,
    faArrowRight,
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router"
import styles from "./GameBanner.module.css"

const GameBanner = () => {
    const navigate = useNavigate()

    return (
        <button
            type="button"
            className={styles.wrapper}
            onClick={() => navigate("/snake-game")}
            title="Take a break! Play Snake Game"
            aria-label="Play Snake Game"
        >
            <span className={styles.icon}>
                <FontAwesomeIcon icon={faGamepad} size="xl" />
            </span>

            <span className={styles.content}>
                <span className={styles.title}>Snake Game</span>
                <span className={styles.description}>
                    Take a break & play!
                </span>
            </span>

            <FontAwesomeIcon
                icon={faArrowRight}
                className={styles.arrow}
            />
        </button>
    )
}

export default GameBanner