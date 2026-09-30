export type Action = "add" | "buy"

export type ActionState = {
    type: Action
    productId: number
    quantity: number
    redirectTo: string
}
