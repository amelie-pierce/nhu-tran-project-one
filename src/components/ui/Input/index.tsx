import styles from "./Input.module.css"

type Props = React.ComponentProps<"input">

const Input = ({ className, ...props }: Props) => {
    return <input {...props} className={`${styles.input} ${className || ""}`} />
}

export default Input
