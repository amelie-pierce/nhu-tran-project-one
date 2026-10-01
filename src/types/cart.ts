import type { Product } from "./product"

export type CartProduct = Partial<Product> & {
    quantity: number
}
