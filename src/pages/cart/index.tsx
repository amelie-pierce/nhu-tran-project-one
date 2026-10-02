import type { CartProduct } from "../../types/cart"
import TotalPrice from "./components/TotalPrice/TotalPrice"
import styles from "./Cart.module.css"
import CartEmpty from "./components/CartEmpty/CartEmtpy"
import CartItem from "./components/CartItem/CartItem"
import { useMemo, useState } from "react"
import Breadcrumb from "../../components/ui/Breadcrumb/Breadcrumb"
import { useUserData } from "../../contexts/UserDataContext"
import {
    getListProduct,
    QUERY_KEY_PRODUCTS,
} from "../../apis/product/getListProduct"
import { useQuery } from "@tanstack/react-query"

const Cart = () => {
    const { cartList, removeFromCartList } = useUserData()
    const [selectedItems, setSelectedItems] = useState<CartProduct[]>([])

    const {
        data: products,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: [QUERY_KEY_PRODUCTS, cartList],
        queryFn: () =>
            getListProduct({
                product_ids: cartList?.map((item) => Number(item.id || 0)),
            }),
    })

    // TODO: consider join cart from db
    const cartProductItems: CartProduct[] = useMemo(
        () =>
            products?.data?.map((item) => {
                const quantity = cartList?.filter(
                    (cart) => cart.id === item.id
                )?.[0]?.quantity

                return {
                    ...item,
                    quantity,
                }
            }) || [],
        [products?.data, cartList]
    )

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
                    {cartProductItems?.map((item) => (
                        <CartItem
                            key={item.id}
                            cart={item}
                            onRemove={() => onRemoveItem(item.id || 0)}
                        />
                    ))}
                </div>
            </div>
            <TotalPrice selectedItems={selectedItems} />
        </>
    )
}

export default Cart
