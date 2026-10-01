import styles from "./Button.module.css"

type Props = React.ComponentProps<"button"> & {
    variant?: "primary" | "secondary" | "border-black"
    icon?: React.ReactElement
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
                bold hover-shadow
                ${styles.btn}
                ${styles[`btn-${variant}`]}
                ${square ? styles.square : ""}
                ${className}
            `}
        >
            {children}

            {icon && <span className={styles.icon}>{icon}</span>}
        </button>
    )
}

export default Button
