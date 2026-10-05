import styles from "./Tag.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

type Props = React.ComponentProps<"div"> & {
    variant?:
        "white" | "light-pink" | "purple" | "light-purple" | "peach" | "green"
    children: React.ReactNode
    onRemove?: () => void
}

const Tag = ({ variant = "white", children, onRemove, ...props }: Props) => {
    return (
        <div
            {...props}
            className={`${props?.onClick || onRemove ? "hover-shadow cursor-pointer" : ""} ${styles.tag} ${styles[`tag-${variant}`]} ${props.className}`}
        >
            {children}

            {onRemove && (
                <FontAwesomeIcon
                    icon={faXmark}
                    className={styles["remove-icon"]}
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
