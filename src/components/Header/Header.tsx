import { Link } from "react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEY_USER } from "@/apis/auth/getUser"
import { signOut } from "@/apis/auth/signOut"
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartShopping } from "@fortawesome/free-solid-svg-icons"
import styles from "./Header.module.css"
import { Button } from "@/components/ui"
import { useNavigate } from "react-router"
import { useToast } from "@/contexts/ToastContext"
import { useUserData } from "@/contexts/UserDataContext"
import { useMemo } from "react"
import { useUser } from "@/contexts/UserContext"

const Header = () => {
    const navigate = useNavigate()
    const { showToast } = useToast()
    const { cartList } = useUserData()
    const queryClient = useQueryClient()
    const { isLoggedIn } = useUser()

    const { mutate: signOutMutation } = useMutation({
        mutationFn: signOut,
        onSuccess: () => {
            showToast({ message: "Logout successful", variant: "success" })
            navigate("/login")
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY_USER],
            })
        },
        onError: () => {
            showToast({ message: "Logout failed", variant: "error" })
        },
    })

    const cartNumber = useMemo(() => {
        if (cartList?.length > 9) return "9+"
        return String(cartList?.length) || ""
    }, [cartList?.length])

    return (
        <header className={`${styles.header} section-padding`}>
            <nav className={styles["menu-header"]}>
                <Link to="/product" className={styles["logo-link"]}>
                    <img
                        src="https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/logo/logo.png"
                        alt="logo"
                        className={styles["logo-header"]}
                    />
                </Link>

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
            <div className={styles["action-header"]}>
                {isLoggedIn ? (
                    <>
                        <div
                            className={styles["icon-wrapper"]}
                            onClick={() => {
                                navigate("/cart")
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faCartShopping}
                                className={styles["icon-cart"]}
                            />
                            {!!Number(cartNumber) && (
                                <div
                                    className={`${styles["icon-number"]} caption bold`}
                                >
                                    {cartNumber}
                                </div>
                            )}
                        </div>
                        <FontAwesomeIcon
                            icon={faRightFromBracket}
                            className={styles["icon-logout"]}
                            onClick={() => signOutMutation()}
                        />
                    </>
                ) : (
                    <Button onClick={() => navigate("/login")}>Login</Button>
                )}
            </div>
        </header>
    )
}

export default Header
