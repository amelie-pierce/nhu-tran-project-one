import type { CartProduct } from "@/types/cart"
import { CartItem, TotalPrice } from "./components"
import styles from "./Cart.module.css"
import Empty from "@/components/Empty/Empty"
import { useMemo, useState } from "react"
import { isDBCartEnabled } from "@/featureFlags"
import { useUserData } from "@/contexts/UserDataContext"
import {
    getListProduct,
    QUERY_KEY_PRODUCTS,
} from "@/apis/product/getListProduct"
import { useQuery } from "@tanstack/react-query"
import { Loader } from "@/components/ui"
import { Error, Breadcrumb } from "@/components"

const Cart = () => {
    const {
        cartList,
        removeFromCartList,
        isCartFetching,
        isCartError,
        isCartLoading,
    } = useUserData()
    const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(
        new Set()
    )
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false)

    const productIds = cartList?.map((item) => Number(item.id)) ?? []

    const {
        data: products,
        isLoading,
        isFetching,
        isError,
    } = useQuery({
        queryKey: [QUERY_KEY_PRODUCTS],
        queryFn: () =>
            getListProduct({
                product_ids: productIds,
            }),
        enabled: productIds.length > 0,
    })

    const cartProductItems: CartProduct[] = useMemo(
        () =>
            cartList
                ?.map((cartItem) => {
                    if (isDBCartEnabled) {
                        return {
                            ...cartItem,
                            checked: selectedItemIds.has(cartItem?.id || 0),
                        }
                    }

                    const product = products?.data?.find(
                        (product) => product.id === cartItem.id
                    )

                    if (!product) return null

                    return {
                        ...product,
                        quantity: cartItem.quantity,
                        checked: selectedItemIds.has(product.id),
                    }
                })
                ?.filter((item) => !!item),
        [cartList, products?.data, selectedItemIds]
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

    if (isError || isCartError) {
        return <Error />
    }

    if (!cartList?.length && !isCartFetching && !isFetching) {
        return <Empty />
    }

    return (
        <>
            <Breadcrumb title="CART" currentPage="Cart" />

            {isLoading || isCartLoading ? (
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
