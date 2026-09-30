import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState, type ReactNode } from "react"
import styles from "./Toast.module.css"

type Props = {
    children: ReactNode
    variant?: "success" | "warning" | "error"
    duration?: number
}

const Toast = ({ children, variant = "success", duration = 1000 }: Props) => {
    const [open, setOpen] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(false)
        }, duration)

        return () => clearTimeout(timer)
    }, [duration])

    if (!open) {
        return null
    }

    return (
        <div className={`${styles.toast} ${styles[variant]}`}>
            {children}

            <FontAwesomeIcon
                icon={faXmark}
                className={styles.close}
                onClick={() => setOpen(false)}
            />
        </div>
    )
}

export default Toast
