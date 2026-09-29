import { Link } from "react-router";
import Text from "../../ui/Text"
import styles from "./Header.module.css";

const Header = () => {
    return (
        <div className={styles.header}>

            <div className={styles["menu-header"]}>
                <div className={styles["logo-header"]}>
                </div>
                <Link to="/product">
                    <Text weight="bold">Product</Text>
                </Link>

                <Link to="/about-me">
                    <Text weight="bold">About</Text>
                </Link>

                <Link to="/compare-product">
                    <Text weight="bold">Compare</Text>
                </Link>
            </div>
            <div className={styles["icon-header"]}>
                {/* <FontAwesomeIcon icon={faCartShopping} /> */}
            </div>
        </div>
    )
}
export default Header