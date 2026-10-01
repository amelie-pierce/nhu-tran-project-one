import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import styles from "./Toast.module.css"

type Props = {
    children: React.ReactNode
    variant?: "success" | "warning" | "error"
    onClose?: () => void
}

const Toast = ({ children, variant = "success", onClose }: Props) => {
    return (
        <div className={`${styles.toast} ${styles[variant]}`}>
            {children}

            <FontAwesomeIcon
                icon={faXmark}
                className={styles["close-icon"]}
                onClick={onClose}
            />
        </div>
    )
}

export default Toast
