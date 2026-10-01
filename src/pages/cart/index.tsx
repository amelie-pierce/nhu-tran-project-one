import { getCart, removeFromCart } from "../../storages/cartStorage"
import type { CartProduct } from "../../types/cart"
import TotalPrice from "./components/TotalPrice/TotalPrice"
import styles from "./Cart.module.css"
import CartEmpty from "./components/CartEmpty/CartEmtpy"
import CartItem from "./components/CartItem/CartItem"
import { useMemo, useState, useEffect } from "react"
import Breadcrumb from "../../components/ui/Breadcrumb/Breadcrumb"

const Cart = () => {
    const [cartItems, setCartItems] = useState<CartProduct[]>([])

    useEffect(() => {
        setCartItems(getCart())
    }, [])

    const onRemoveItem = (cartId: number) => {
        removeFromCart(cartId)
        setCartItems(getCart())
    }

    const cartTotalStr = useMemo(() => {
        return `${cartItems?.length} ${cartItems?.length === 1 ? "item" : "items"}`
    }, [cartItems])

    if (cartItems?.length === 0) {
        return <CartEmpty />
    }

    return (
        <>
            <Breadcrumb title="CART" currentPage="Cart" />
            <div className={`${styles["cart-container"]} page-padding`}>
                <label className={`${styles["cart-title"]} title bold`}>
                    Your Cart
                </label>
                <div className={styles["cart-items-container"]}>
                    <div className={styles["cart-select-all"]}>
                        <input type="checkbox" />
                        <label>Select all ({cartTotalStr})</label>
                    </div>
                    {cartItems?.map((cart) => (
                        <CartItem
                            key={cart.id}
                            cart={cart}
                            onRemove={() => onRemoveItem(cart.id || 0)}
                        />
                    ))}
                </div>
            </div>
            <TotalPrice selectedProducts={cartItems} />
        </>
    )
}

export default Cart
