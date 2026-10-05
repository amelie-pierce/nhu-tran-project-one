import type { CartProduct } from "../../types/cart"
import TotalPrice from "./components/TotalPrice/TotalPrice"
import styles from "./Cart.module.css"
import Empty from "../../components/ui/Empty/Emtpy"
import CartItem from "./components/CartItem/CartItem"
import { useCallback, useEffect, useMemo, useState } from "react"
import Breadcrumb from "../../components/ui/Breadcrumb/Breadcrumb"
import { useUserData } from "../../contexts/UserDataContext"
import {
    getListProduct,
    QUERY_KEY_PRODUCTS,
} from "../../apis/product/getListProduct"
import { useQuery } from "@tanstack/react-query"

const Cart = () => {
    const { cartList, removeFromCartList } = useUserData()
    const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(
        new Set()
    )
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false)

    const {
        data: products,
        isLoading,
        isError,
    } = useQuery({
        queryKey: [
            QUERY_KEY_PRODUCTS,
            cartList?.map((item) => item.id).join(","),
        ],
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
                    checked: selectedItemIds.has(item.id),
                }
            }) || [],
        [products?.data, cartList, selectedItemIds]
    )

    const onRemoveItem = (id: number) => {
        removeFromCartList(id)
    }

    const handleSelectAll = () => {
        const isChecked = !isSelectAllChecked
        setIsSelectAllChecked(isChecked)

        if (isChecked) {
            const setOfItems = new Set(
                cartProductItems?.map((item) => Number(item.id))
            )
            setSelectedItemIds(setOfItems)
        } else {
            setSelectedItemIds(new Set())
        }
    }

    const handleToggleSelectItem = (item: CartProduct) => {
        const isChecked = selectedItemIds?.has(item.id || 0)
        let newSelectedItemIds = new Set(selectedItemIds)
        if (isChecked) {
            newSelectedItemIds.delete(item.id || 0)
        } else {
            newSelectedItemIds.add(item.id || 0)
        }
        setSelectedItemIds(newSelectedItemIds)

        if (newSelectedItemIds.size === cartProductItems?.length) {
            setIsSelectAllChecked(true)
        } else {
            setIsSelectAllChecked(false)
        }
    }

    const cartTotalStr = useMemo(() => {
        return `${cartList?.length} ${cartList?.length === 1 ? "item" : "items"}`
    }, [cartList])

    if (cartList?.length === 0) {
        return <Empty />
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
                        <input
                            type="checkbox"
                            checked={isSelectAllChecked}
                            onChange={handleSelectAll}
                        />
                        <label>Select all ({cartTotalStr})</label>
                    </div>
                    {cartProductItems?.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onRemove={() => onRemoveItem(item.id || 0)}
                            onToggleCheck={handleToggleSelectItem}
                        />
                    ))}
                </div>
            </div>
            <TotalPrice
                selectedItems={cartProductItems?.filter((item) =>
                    selectedItemIds.has(item.id || 0)
                )}
            />
        </>
    )
}

export default Cart
