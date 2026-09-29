import { Link } from "react-router";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import Text from "../../ui/Text"
import styles from "./Header.module.css";
import Button from "../../ui/Button";

const Header = () => {
    return (
        <header className={styles.header}>
            <nav className={styles["menu-header"]}>
                <img
                    src="https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/logo/logo.png"
                    alt="logo"
                    className={styles["logo-header"]}
                />
                <Link to="/product">
                    <Text weight="bold">Product</Text>
                </Link>

                <Link to="/about-me">
                    <Text weight="bold">About</Text>
                </Link>

                <Link to="/compare-product">
                    <Text weight="bold">Compare</Text>
                </Link>
            </nav>
            <div className={styles["icon-header"]}>
                <Button title="Login" />
                <div className={styles["cart-wrapper"]}>
                    <FontAwesomeIcon
                        icon={faCartShopping}
                        className={styles.icon}
                    />

                    <div className={styles["cart-number"]}>
                        <Text variant="caption" weight="bold">9+</Text>
                    </div>
                </div>
                <FontAwesomeIcon
                    icon={faRightToBracket}
                    className={styles.icon}
                />
            </div>
        </header>
    )
}

export default Header