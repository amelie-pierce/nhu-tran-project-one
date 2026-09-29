import styles from "./Button.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

type Props = {
    variant?: "primary" | "secondary" | "border-black";
    children: React.ReactNode;
    icon?: IconProp;
    disabled?: boolean;
    className?: string;
};

const Button = ({
    variant = "primary",
    children,
    icon,
    disabled = false,
    className,
}: Props) => {
    return (
        <button
            disabled={disabled}
            className={`bold ${styles.btn} ${styles[`btn-${variant}`]} ${className}`}
        >
            {children}

            {icon && <FontAwesomeIcon icon={icon} />}
        </button>
    );
};
export default Button;