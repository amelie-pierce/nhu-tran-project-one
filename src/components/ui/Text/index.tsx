import styles from "./Text.module.css"

type Props = {
    children: React.ReactNode
    className?: string
    variant?: "heading" | "title" | "body" | "caption"
    weight?: "regular" | "bold"
}
const Text = ({ children, className, variant = "body", weight = "regular" }: Props) => {
    return (
        <div className={`${styles[variant]} ${styles[weight]} ${className || ""}`}>
            {children}
        </div>
    );
};

export default Text;