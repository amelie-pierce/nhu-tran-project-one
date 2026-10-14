import type { CartProduct } from "@/types/cart"
import { Navigate } from "react-router"
import { CartItem, TotalPrice } from "./components"
import styles from "./Cart.module.css"
import Empty from "@/components/Empty/Empty"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useUser } from "@/contexts/UserContext"
import { useUserData } from "@/contexts/UserDataContext"
import {
    getListProduct,
    QUERY_KEY_PRODUCTS,
} from "@/apis/product/getListProduct"
import { useQuery } from "@tanstack/react-query"
import { Loader } from "@/components/ui"
import { Error, Breadcrumb } from "@/components"

const Cart = () => {
    const { isLoggedIn } = useUser()
    const { cartList, isCartFetching, removeFromCartList } = useUserData()
    const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(
        new Set()
    )
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false)

    const productIds = useMemo(
        () => cartList?.map((item) => Number(item.id)) ?? [],
        [cartList]
    )

    const { data: products, isError } = useQuery({
        queryKey: [QUERY_KEY_PRODUCTS, productIds],
        queryFn: () =>
            getListProduct({
                product_ids: productIds,
            }),
        staleTime: 1000 * 60 * 5,
        enabled: productIds.length > 0,
    })

    const cartProductItems: CartProduct[] = useMemo(
        () =>
            cartList
                ?.map((cartItem) => ({
                    ...cartItem,
                    checked: selectedItemIds.has(cartItem?.id || 0),
                }))
                ?.filter((item) => !!item),
        [cartList, products?.data, selectedItemIds]
    )

    const onRemoveItem = useCallback(
        (id: number) => {
            removeFromCartList(id)
            setSelectedItemIds((prev) => {
                if (!prev.has(id)) return prev
                const newSet = new Set(prev)
                newSet.delete(id)
                return newSet
            })
        },
        [removeFromCartList]
    )

    const handleToggleSelectItem = useCallback((item: CartProduct) => {
        const id = item.id || 0
        setSelectedItemIds((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }, [])

    const handleSelectAll = useCallback(() => {
        setIsSelectAllChecked((prevSelectAll) => {
            const nextSelectAll = !prevSelectAll
            if (nextSelectAll) {
                const setOfItems = new Set(
                    cartProductItems?.map((item) => Number(item.id))
                )
                setSelectedItemIds(setOfItems)
            } else {
                setSelectedItemIds(new Set())
            }
            return nextSelectAll
        })
    }, [cartProductItems])

    useEffect(() => {
        if (
            cartProductItems?.length > 0 &&
            selectedItemIds.size === cartProductItems.length
        ) {
            setIsSelectAllChecked(true)
        } else {
            setIsSelectAllChecked(false)
        }
    }, [selectedItemIds, cartProductItems])

    const cartTotalStr = useMemo(() => {
        return `${cartList?.length} ${cartList?.length === 1 ? "item" : "items"}`
    }, [cartList])

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />
    }

    if (isError) {
        return <Error />
    }

    if (!cartList?.length && !isCartFetching) {
        return <Empty />
    }

    return (
        <>
            <Breadcrumb title="CART" currentPage="Cart" />

            {!cartList?.length && isCartFetching ? (
                <Loader />
            ) : (
                <>
                    <div className={`${styles["cart-container"]} page-padding`}>
                        <label className={`${styles["cart-title"]} title bold`}>
                            Your cart
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
            )}
        </>
    )
}

export default Cart
