import { Link } from "react-router"
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartShopping } from "@fortawesome/free-solid-svg-icons"
import styles from "./Header.module.css"
import Button from "../../ui/Button/Button"
import { useNavigate } from "react-router"

const Header = () => {
    const navigate = useNavigate()

    return (
        <header className={styles.header}>
            <nav className={styles["menu-header"]}>
                <img
                    src="https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/logo/logo.png"
                    alt="logo"
                    className={styles["logo-header"]}
                />
                <Link to="/product" className="bold">
                    Product
                </Link>

                <Link to="/about-me" className="bold">
                    About
                </Link>

                <Link to="/compare-product" className="bold">
                    Compare
                </Link>
            </nav>
            <div className={styles["icon-header"]}>
                <Button onClick={() => navigate("/login")}>Login</Button>
                <div className={styles["cart-wrapper"]}>
                    <FontAwesomeIcon
                        icon={faCartShopping}
                        className={styles.icon}
                    />

                    <div className={`${styles["cart-number"]} caption bold`}>
                        9+
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
