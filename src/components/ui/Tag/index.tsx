import styles from "./Tag.module.css";
import Text from "../Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

type Props = {
    variant?: "white" | "light-pink" | "purple" | "light-purple" | "peach" | "green";
    title: string;
    icon?: IconProp;
    onClick?: () => void;
    onIconClick?: () => void;
};

const Tag = ({
    variant = "white",
    title,
    icon = faXmark,
    onClick,
    onIconClick,
}: Props) => {
    return (
        <div
            className={`${onClick || onIconClick ? "hover-shadow" : ""} ${styles.tag} ${styles[`tag-${variant}`]}`}
            onClick={onClick}
        >
            <Text weight="bold">{title}</Text>

            {!!onIconClick && (
                <button
                    type="button"
                    className={styles.icon}
                    onClick={(e) => {
                        e.stopPropagation();
                        onIconClick?.();
                    }}
                >
                    <FontAwesomeIcon icon={icon} />
                </button>
            )}
        </div>
    );
};

export default Tag;