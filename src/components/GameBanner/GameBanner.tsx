import { useNavigate } from "react-router"
import styles from "./GameBanner.module.css"

const GameBanner = () => {
    const navigate = useNavigate()

    return (
        <button
            className={styles.wrapper}
            onClick={() => navigate("/snake-game")}
            title="Take a break! Play Snake Game"
            aria-label="Play Snake Game"
        >
            <span>🎮</span>
            <span>Play</span>
            <span>↗</span>
        </button>
    )
}

export default GameBanner