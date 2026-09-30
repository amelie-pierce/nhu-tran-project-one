import styles from "./Button.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { IconProp } from "@fortawesome/fontawesome-svg-core"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "border-black"
    icon?: IconProp
    square?: boolean
}

const Button = ({
    variant = "primary",
    children,
    className,
    icon,
    square = false,
    ...props
}: Props) => {
    return (
        <button
            {...props}
            className={`
                bold
                ${styles.btn}
                ${styles[`btn-${variant}`]}
                ${square ? styles.square : ""}
                ${className}
            `}
        >
            {children}

            {icon && <FontAwesomeIcon icon={icon} />}
        </button>
    )
}

export default Button
