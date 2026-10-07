import { Link, useLocation } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { faFacebook, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faPhone } from "@fortawesome/free-solid-svg-icons"
import styles from "./Footer.module.css"
import { useScreenWidth } from "../../../hooks/useScreenWidth"

const Footer = () => {
    const screenWidth = useScreenWidth()
    const location = useLocation()

    const isDesktop = screenWidth > 1024

    // Custom Login Styles
    const isLoginTablet =
        screenWidth > 480 &&
        screenWidth <= 1024 &&
        location.pathname === "/login"
    const isLoginMobile = screenWidth <= 480 && location.pathname === "/login"

    return (
        <footer
            className={`${styles.footer} page-padding ${isLoginMobile ? styles["footer-login-mobile"] : ""}`}
        >
            <div
                className={`${styles.wrapper} ${isLoginTablet ? styles["wrapper-login-tablet"] : ""}`}
            >
                <div className={styles["logo-area"]}>
                    <div className={styles["logo-container"]}>
                        <img
                            src="https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/logo/logo.png"
                            alt="logo"
                            className={styles["logo-footer"]}
                        />
                        <div className="text-primary">Beauty & skincare</div>
                    </div>
                </div>
                <div className={styles["footer-content"]}>
                    <div className={styles["footer-section"]}>
                        <div className="bold text-primary">SHOP</div>
                        <Link to="/product">Product Catalog</Link>
                        <Link to="/compare-product">Compare Products</Link>
                        <Link to="/cart">Cart</Link>
                    </div>
                    <div
                        className={`${styles["footer-section"]} ${isDesktop ? styles["footer-section-about-desktop"] : ""}`}
                    >
                        <div className="bold text-primary"> ABOUT</div>
                        <Link to="/about-me">About Me</Link>
                        <div className={styles["social-media"]}>
                            <a
                                href="mailto:ntran2@strongtie.com"
                                className={styles["social-link"]}
                            >
                                <FontAwesomeIcon
                                    className={styles["envelop-icon"]}
                                    icon={faEnvelope}
                                />
                            </a>
                            <a
                                href="https://www.facebook.com/trntnhu/"
                                className={styles["social-link"]}
                            >
                                <FontAwesomeIcon
                                    className={styles["social-icon"]}
                                    icon={faFacebook}
                                />
                            </a>
                            <a
                                href="https://vn.linkedin.com/in/trntnhu"
                                className={styles["social-link"]}
                            >
                                <FontAwesomeIcon
                                    className={styles["linkedin-icon"]}
                                    icon={faLinkedin}
                                />
                            </a>
                            <a
                                href="tel:+84942275188"
                                className={styles["social-link"]}
                            >
                                <FontAwesomeIcon
                                    className={styles["phone-icon"]}
                                    icon={faPhone}
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
