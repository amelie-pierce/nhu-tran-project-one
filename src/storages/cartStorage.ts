import type { CartProduct } from "@/types/cart"

const CART_STORAGE_KEY = "cart"

export const getCart = (): CartProduct[] => {
    const data = localStorage.getItem(CART_STORAGE_KEY)
    return data ? JSON.parse(data) : []
}

export const addToCart = (
    cartList: CartProduct[] = getCart(),
    id: number,
    quantity: number
): CartProduct[] => {
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
    return newCartList
}

export const updateCart = (
    cartList: CartProduct[] = getCart(),
    id: number,
    quantity: number
): CartProduct[] => {
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
    return newCartList
}

export const removeFromCart = (
    cartList: CartProduct[] = getCart(),
    id: number
): CartProduct[] => {
    const newCartList = cartList.filter((item) => item.id !== id)
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCartList))
    return newCartList
}
