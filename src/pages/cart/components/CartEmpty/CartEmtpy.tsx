import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import Button from "../../../../components/ui/Button/Button"
import styles from "./CartEmtpy.module.css"
import { useNavigate } from "react-router"

const CartEmpty = () => {
    const navigate = useNavigate()
    return (
        <div className={styles["cart-empty-container"]}>
            <p className={styles["cart-empty-text"]}>Your cart is empty</p>
            <Button
                icon={<FontAwesomeIcon icon={faArrowRight} />}
                onClick={() => {
                    navigate("/product")
                }}
            >
                Browse to Product
            </Button>
        </div>
    )
}

export default CartEmpty
