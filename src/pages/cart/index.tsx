import { getCart } from "../../storages/cartStorage"
import TotalPrice from "./components/TotalPrice/TotalPrice"
import styles from "./Cart.module.css"
import CartEmpty from "./components/CartEmpty/CartEmtpy"
import CartItem from "./components/CartItem/CartItem"
import { useMemo } from "react"
import Breadcumb from "../../components/ui/Breadcrumb/Breadcrumb"

const Cart = () => {
    const carts = getCart()

    const cartTotalStr = useMemo(() => {
        return `${carts?.length} ${carts?.length === 1 ? "item" : "items"}`
    }, [carts])

    if (carts?.length === 0) {
        return <CartEmpty />
    }

    return (
        <>
            <Breadcumb title="CART" currentPage="Cart" />
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
            <TotalPrice selectedProducts={carts} />
        </>
    )
}

export default Cart
