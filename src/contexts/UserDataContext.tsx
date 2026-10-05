import React, { createContext, useContext, useEffect, useState } from "react"
import type { CartProduct } from "../types/cart"
import {
    addToCart,
    getCart,
    removeFromCart,
    updateCart,
} from "../storages/cartStorage"
import {
    getCompare,
    removeAllCompare,
    toggleCompare,
} from "../storages/compareStorage"
import { useToast } from "../components/ui/Toast/ToastContext"
import { MAX_QUANTITY } from "../constants"

type UserDataType = {
    cartList: CartProduct[]
    compareList: number[]
    updateCartList: (
        id: number,
        quantity: number,
        checkCondition: boolean
    ) => void
    addToCartList: (id: number, quantity: number) => void
    removeFromCartList: (id: number) => void
    toggleCompareItem: (id: number) => void
    removeAllCompareItems: () => void
}

const UserDataContext = createContext<UserDataType | null>(null)

type Props = {
    children: React.ReactNode
}

export const UserDataProvider = ({ children }: Props) => {
    const [cartList, setCartList] = useState<CartProduct[]>([])
    const [compareList, setCompareList] = useState<number[]>([])
    const { showToast } = useToast()

    useEffect(() => {
        setCartList(getCart())
        setCompareList(getCompare())
    }, [])

    const checkConditionAddToCart = (
        productId: number,
        quantity: number
    ): boolean => {
        const itemInCart = cartList.find((item) => item.id === productId)
        const quantityInCart = itemInCart?.quantity || 0
        const maxAddable = MAX_QUANTITY - quantityInCart

        if (quantity <= maxAddable) {
            showToast({
                message: "Added to cart successfully",
                variant: "success",
            })
            return true
        }

        if (maxAddable === 0) {
            showToast({
                message:
                    "Your cart already contains the maximum quantity for this product.",
                variant: "error",
            })
            return false
        }

        if (quantity > maxAddable) {
            showToast({
                message: `Your cart already has ${quantityInCart} items. You can add up to ${maxAddable} more.`,
                variant: "warning",
            })
            return false
        }

        return false
    }

    const updateCartList = (
        id: number,
        quantity: number,
        checkCondition = true
    ) => {
        const isSuccess = checkCondition
            ? checkConditionAddToCart(id, quantity)
            : true
        if (isSuccess) {
            const newCartList = updateCart(cartList, id, quantity)
            setCartList(newCartList)
        }
    }

    const addToCartList = (id: number, quantity: number) => {
        const isSuccess = checkConditionAddToCart(id, quantity)
        if (isSuccess) {
            const newCartList = addToCart(cartList, id, quantity)
            setCartList(newCartList)
        }
    }

    const removeFromCartList = (id: number) => {
        const newCartList = removeFromCart(cartList, id)
        setCartList(newCartList)
    }

    const toggleCompareItem = (id: number) => {
        const newCompareList = toggleCompare(id)
        setCompareList(newCompareList)
    }

    const removeAllCompareItems = () => {
        removeAllCompare()
        setCompareList([])
    }

    return (
        <UserDataContext.Provider
            value={{
                cartList,
                compareList,
                updateCartList,
                addToCartList,
                removeFromCartList,
                toggleCompareItem,
                removeAllCompareItems,
            }}
        >
            {children}
        </UserDataContext.Provider>
    )
}

export const useUserData = () => {
    const context = useContext(UserDataContext)

    if (!context) {
        throw new Error("useToast must be used inside ToastProvider")
    }

    return context
}
