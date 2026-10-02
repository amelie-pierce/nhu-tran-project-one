import type { CartProduct } from "./cart"

export type Action = "add" | "buy"

export type ActionState = {
    type: Action
    items: CartProduct[]
    redirectTo: string
}
