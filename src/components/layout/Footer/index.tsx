import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import Text from "../../ui/Text";
import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles["logo-area"]}>
                <div className={styles["logo-container"]}>
                    <img
                        src="https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/logo/logo.png"
                        alt="logo"
                        className={styles["logo-footer"]}
                    />
                    <Text color="primary">Beauty & skincare</Text>
                </div>
            </div>
            <div className={styles["footer-content"]}>
                <div className={styles["footer-section"]}>
                    <Text color="primary" weight="bold">
                        SHOP
                    </Text>
                    <Link to="/product">
                        <Text>
                            Product Catalog
                        </Text>
                    </Link>
                    <Link to="/compare-product">
                        <Text>
                            Compare Products
                        </Text>
                    </Link>
                    <Link to="/cart">
                        <Text>
                            Cart
                        </Text>
                    </Link>
                </div>
                <div className={styles["footer-section"]}>
                    <Text color="primary" weight="bold">
                        ABOUT
                    </Text>
                    <Link to="/about-me">
                        <Text>
                            About Me
                        </Text>
                    </Link>
                    <div className={styles["social-media"]}>
                        <a href="mailto:ntran2@strongtie.com" className={styles["social-link"]}>
                            <FontAwesomeIcon
                                className={styles["social-icon"]}
                                icon={faEnvelope}
                            />
                        </a>
                        <a href="https://www.facebook.com/trntnhu/" className={styles["social-link"]}>
                            <FontAwesomeIcon
                                className={styles["social-icon"]}
                                icon={faFacebook}
                            />
                        </a>
                        <a href="https://vn.linkedin.com/in/trntnhu" className={styles["social-link"]}>
                            <FontAwesomeIcon
                                className={styles["social-icon"]}
                                icon={faLinkedin}
                            />
                        </a>
                        <a href="tel:+84942275188" className={styles["social-link"]}>
                            <FontAwesomeIcon
                                className={styles["social-icon"]}
                                icon={faPhone}
                            />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer