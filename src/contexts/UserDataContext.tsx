import React, { createContext, useContext, useEffect, useState } from "react"
import type { CartProduct } from "../types/cart"
import {
    addToCart,
    getCart,
    removeFromCart,
    updateCart,
} from "../storages/cartStorage"
import { getCompare, toggleCompare } from "../storages/compareStorage"

type UserDataType = {
    cartList: CartProduct[]
    compareList: number[]
    updateCartList: (id: number, quantity: number) => void
    addToCartList: (id: number, quantity: number) => void
    removeFromCartList: (id: number) => void
    toggleCompareItem: (id: number) => void
}

const UserDataContext = createContext<UserDataType | null>(null)

type Props = {
    children: React.ReactNode
}

export const UserDataProvider = ({ children }: Props) => {
    const [cartList, setCartList] = useState<CartProduct[]>([])
    const [compareList, setCompareList] = useState<number[]>([])

    useEffect(() => {
        setCartList(getCart())
        setCompareList(getCompare())
    }, [])

    const updateCartList = (id: number, quantity: number) => {
        const newCartList = updateCart(cartList, id, quantity)
        setCartList(newCartList)
    }

    const addToCartList = (id: number, quantity: number) => {
        const newCartList = addToCart(cartList, id, quantity)
        setCartList(newCartList)
    }

    const removeFromCartList = (id: number) => {
        const newCartList = removeFromCart(cartList, id)
        setCartList(newCartList)
    }

    const toggleCompareItem = (id: number) => {
        const newCompareList = toggleCompare(id)
        setCompareList(newCompareList)
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
