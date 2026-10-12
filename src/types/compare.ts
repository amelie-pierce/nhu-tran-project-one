import type { Product } from "@/types/product"

export type UserCompare = {
    product_id: number
    user_id?: string
    product: Product
}
