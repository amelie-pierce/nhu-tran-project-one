import type { UserCompare } from "@/types/compare"
import type { Product } from "@/types/product"

const COMPARE_STORAGE_KEY = "compare"

export const getCompareStorage = (): UserCompare[] => {
    const data = localStorage.getItem(COMPARE_STORAGE_KEY)
    return data ? JSON.parse(data) : []
}

export const toggleCompareStorage = (product: Product): UserCompare[] => {
    const compare = getCompareStorage()

    const newCompare = compare.some((item) => item.product_id === product.id)
        ? compare.filter((item) => item.product_id !== product.id)
        : [...compare, { product_id: product.id, product }]

    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(newCompare))

    return newCompare
}

export const removeAllCompareStorage = () => {
    localStorage.removeItem(COMPARE_STORAGE_KEY)
}
