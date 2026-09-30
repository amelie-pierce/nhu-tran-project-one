import styles from "./Tag.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import type { ReactNode } from "react"

type Props = {
    variant?:
        "white" | "light-pink" | "purple" | "light-purple" | "peach" | "green"
    children: ReactNode
    onClick?: () => void
    onRemove?: () => void
}

const Tag = ({ variant = "white", children, onClick, onRemove }: Props) => {
    return (
        <div
            className={`${onClick || onRemove ? "hover-shadow" : ""} ${styles.tag} ${styles[`tag-${variant}`]}`}
            onClick={onClick}
        >
            {children}

            {onRemove && (
                <FontAwesomeIcon
                    icon={faXmark}
                    className={styles["icon-remove"]}
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove()
                    }}
                />
            )}
        </div>
    )
}

export default Tag
