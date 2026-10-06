import { Link } from "react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUser, QUERY_KEY_USER } from "../../../apis/auth/getUser"
import { signOut } from "../../../apis/auth/signOut"
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartShopping } from "@fortawesome/free-solid-svg-icons"
import styles from "./Header.module.css"
import Button from "../../ui/Button/Button"
import { useNavigate } from "react-router"
import { useToast } from "../../ui/Toast/ToastContext"
import { useUserData } from "../../../contexts/UserDataContext"
import { useMemo } from "react"

const Header = () => {
    const navigate = useNavigate()
    const { showToast } = useToast()
    const { cartList } = useUserData()
    const queryClient = useQueryClient()

    const { data: user } = useQuery({
        queryKey: [QUERY_KEY_USER],
        queryFn: getUser,
    })

    const signOutMutation = useMutation({
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
                <Link to="/product"  className={styles["logo-link"]}>
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
                {!user && (
                    <Button onClick={() => navigate("/login")}>Login</Button>
                )}
                {user && (
                    <>
                        <div
                            className={styles["icon-wrapper"]}
                            onClick={() => {
                                navigate("/cart")
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faCartShopping}
                                className={styles.icon}
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
                            icon={faRightToBracket}
                            className={styles.icon}
                            onClick={() => signOutMutation.mutate()}
                        />
                    </>
                )}
            </div>
        </header>
    )
}

export default Header
