import type { CartProduct } from "@/types/cart"

const CART_STORAGE_KEY = "cart"

export const getCartStorage = (): CartProduct[] => {
    const data = localStorage.getItem(CART_STORAGE_KEY)
    return data ? JSON.parse(data) : []
}

export const addToCartStorage = (
    cartList: CartProduct[] = getCartStorage(),
    id: number,
    quantity: number
) => {
    const newCartList = [...cartList]
    const existingItem = newCartList.find((item) => item.id === id)
    if (existingItem) {
        existingItem.quantity += quantity
    } else {
        newCartList.push({
            id,
            quantity,
        })
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCartList))
}

export const updateCartStorage = (
    cartList: CartProduct[] = getCartStorage(),
    id: number,
    quantity: number
) => {
    const newCartList = [...cartList]
    const existingItem = newCartList.find((item) => item.id === id)
    if (existingItem) {
        existingItem.quantity = quantity
    } else {
        newCartList.push({
            id,
            quantity,
        })
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCartList))
}

export const removeFromCartStorage = (
    cartList: CartProduct[] = getCartStorage(),
    id: number
) => {
    const newCartList = cartList.filter((item) => item.id !== id)
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCartList))
}
