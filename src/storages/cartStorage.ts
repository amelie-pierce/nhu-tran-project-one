import type { CartProduct } from "../types/cart"

const CART_STORAGE_KEY = "cart"

export const getCart = (): CartProduct[] => {
    const data = localStorage.getItem(CART_STORAGE_KEY)
    return data ? JSON.parse(data) : []
}

export const addToCart = (id: number, quantity: number) => {
    const cart = getCart()
    const existingItem = cart.find((item) => item.id === id)
    if (existingItem) {
        existingItem.quantity += quantity
    } else {
        cart.push({
            id,
            quantity,
        })
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
}

export const updateCart = (id: number, quantity: number) => {
    const cart = getCart()
    const existingItem = cart.find((item) => item.id === id)
    if (existingItem) {
        existingItem.quantity = quantity
    } else {
        cart.push({
            id,
            quantity,
        })
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
}

export const removeFromCart = (id: number) => {
    const cart = getCart()
    const newCart = cart.filter((item) => item.id !== id)
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart))
}
