import { supabase } from "@/lib/supabase"
import { getCurrentUserId } from "../auth/getCurrentUserId"
export const QUERY_KEY_USER_CART = "user_cart"

export type UpdateUserCartRequest = {
    product_id: number
    quantity: number
}

export const updateUserCart = async (values: UpdateUserCartRequest) => {
    const userId = await getCurrentUserId()

    if (!userId) {
        return null
    }

    const { data, error } = await supabase
        .from("user_cart")
        .update({
            quantity: values.quantity,
        })
        .eq("user_id", userId)
        .eq("product_id", values.product_id)

    if (error) {
        throw error
    }

    return data
}
