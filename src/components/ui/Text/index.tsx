import styles from "./Text.module.css"

type Props = {
    children: React.ReactNode
    className?: string
    variant?: "heading" | "title" | "body" | "caption"
    weight?: "regular" | "bold"
    color?: "primary"
}
const Text = ({ children, className, variant = "body", weight = "regular", color }: Props) => {
    return (
        <div className={`${styles[variant]} ${styles[weight]} ${color ? styles[`color-${color}`] : ""} ${className || ""}`} >
            {children}
        </div>
    );
};

export default Text;