import type { CartProduct } from "../../types/cart"
import TotalPrice from "./components/TotalPrice/TotalPrice"
import styles from "./Cart.module.css"
import CartEmpty from "./components/CartEmpty/CartEmtpy"
import CartItem from "./components/CartItem/CartItem"
import { useMemo, useState } from "react"
import Breadcrumb from "../../components/ui/Breadcrumb/Breadcrumb"
import { useUserData } from "../../contexts/UserDataContext"

const Cart = () => {
    const { cartList, removeFromCartList } = useUserData()
    const [selectedItems, setSelectedItems] = useState<CartProduct[]>([])

    const onRemoveItem = (id: number) => {
        removeFromCartList(id)
    }

    const cartTotalStr = useMemo(() => {
        return `${cartList?.length} ${cartList?.length === 1 ? "item" : "items"}`
    }, [cartList])

    if (cartList?.length === 0) {
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
                    {cartList?.map((cart) => (
                        <CartItem
                            key={cart.id}
                            cart={cart}
                            onRemove={() => onRemoveItem(cart.id || 0)}
                        />
                    ))}
                </div>
            </div>
            <TotalPrice selectedItems={selectedItems} />
        </>
    )
}

export default Cart
