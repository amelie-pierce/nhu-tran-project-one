import type { Product } from "./product"

export type CartProduct = Partial<Product> & {
    quantity: number
    checked?: boolean
}

export type UserCart = {
    product_id: number
    user_id: number
    quantity: number
    product: Product
}
