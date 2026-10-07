import React, { createContext, useContext, useEffect, useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { QUERY_KEY_USER_CART } from "@/apis/cart/getUserCart"
import type { CartProduct, UserCart } from "@/types/cart"
import {
    addToCart,
    getCart,
    removeFromCart,
    updateCart,
} from "@/storages/cartStorage"
import {
    getCompare,
    removeAllCompare,
    toggleCompare,
} from "@/storages/compareStorage"
import { useToast } from "@/contexts/ToastContext"
import { MAX_QUANTITY } from "@/constants"
import { getUserCart } from "@/apis/cart/getUserCart"
import flagsmith from "@/lib/flagsmith"
import { createUserCart } from "@/apis/cart/createUserCart"

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
    isCartFetching: boolean
    isCartLoading: boolean
    isCartError: boolean
}

const UserDataContext = createContext<UserDataType | null>(null)

type Props = {
    children: React.ReactNode
}

export const UserDataProvider = ({ children }: Props) => {
    const dbEnabled = flagsmith.hasFeature("db_enabled")
    const [cartList, setCartList] = useState<CartProduct[]>(getCart())
    const [compareList, setCompareList] = useState<number[]>(getCompare())
    const { showToast } = useToast()

    const {
        data: userCart,
        isLoading: isCartLoading,
        isError: isCartError,
        isFetching: isCartFetching,
    } = useQuery({
        queryKey: [QUERY_KEY_USER_CART],
        queryFn: getUserCart,
        enabled: dbEnabled,
    })

    const createCartMutation = useMutation({
        mutationFn: createUserCart,
        onSuccess: (data) => {
            setCartList((prevCartList) => [
                ...prevCartList,
                {
                    ...data.product,
                    quantity: data.quantity,
                },
            ])
        },
        onError: (error) => {
            showToast({
                message: (error as Error).message,
                variant: "error",
            })
        },
    })

    const pareCartAPIResponse = (cartList: UserCart[]): CartProduct[] => {
        return cartList?.map((item) => ({
            ...item.product,
            quantity: item.quantity,
        }))
    }

    useEffect(() => {
        if (!!userCart?.length && dbEnabled) {
            setCartList(pareCartAPIResponse(userCart))
        } else {
            setCartList(getCart())
        }
        setCompareList(getCompare())
    }, [userCart])

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

    const addToCartList = (product_id: number, quantity: number) => {
        const isSuccess = checkConditionAddToCart(product_id, quantity)
        if (!isSuccess) return

        if (dbEnabled) {
            createCartMutation.mutate({
                product_id,
                quantity,
            })
        } else {
            const newCartList = addToCart(cartList, product_id, quantity)
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
                isCartLoading,
                isCartError,
                isCartFetching,
            }}
        >
            {children}
        </UserDataContext.Provider>
    )
}

export const useUserData = () => {
    const context = useContext(UserDataContext)

    if (!context) {
        throw new Error("useUserData must be used inside UserDataProvider")
    }

    return context
}
