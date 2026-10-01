import { getCart } from "../../storages/cartStorage"
import styles from "./Cart.module.css"
import CartEmpty from "./components/CartEmpty/CartEmtpy"
import CartItem from "./components/CartItem/CartItem"
import { useMemo } from "react"

const Cart = () => {
    const carts = getCart()

    const cartTotalStr = useMemo(() => {
        return `${carts?.length} ${carts?.length === 1 ? "item" : "items"}`
    }, [carts])

    if (carts?.length === 0) {
        return <CartEmpty />
    }

    return (
        <div className={styles["cart-container"]}>
            <label className={`${styles["cart-title"]} title bold`}>
                Your Cart
            </label>
            <div className={styles["cart-items-container"]}>
                <div className={styles["cart-select-all"]}>
                    <input type="checkbox" />
                    <label>Select all ({cartTotalStr})</label>
                </div>
                {carts?.map((cart) => (
                    <CartItem key={cart.id} cart={cart} />
                ))}
            </div>
        </div>
    )
}

export default Cart
