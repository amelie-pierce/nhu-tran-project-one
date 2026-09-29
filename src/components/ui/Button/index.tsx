import styles from "./Button.module.css";
import Text from "../Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

type Props = {
    variant?: "primary" | "secondary" | "border-black";
    title: string;
    icon?: IconProp;
};

const Button = ({ variant = "primary", title, icon }: Props) => {
    return (
        <button className={`hover-shadow ${styles.btn} ${styles[`btn-${variant}`]}`}>
            <Text weight="bold">{title}</Text>
            {icon && <FontAwesomeIcon icon={icon} />}
        </button>
    );
};

export default Button;