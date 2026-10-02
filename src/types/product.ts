import type { Category } from "./category"
import type { Ingredient } from "./ingredient"

export type Product = {
    id: number
    name: string
    price: number
    description: string | null
    category_id: string | null
    category: Category | null
    img_url: string | null
    ingredient: Ingredient[]
}
