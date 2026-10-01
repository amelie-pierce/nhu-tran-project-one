import type { Product } from "./product"

export type OrderProduct = Product & {
    quantity: number
}
