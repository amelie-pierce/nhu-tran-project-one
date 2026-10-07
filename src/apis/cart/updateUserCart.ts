import { supabase } from "@/lib/supabase"

export const QUERY_KEY_USER_CART = "user_cart"

export type UpdateUserCartRequest = {
    product_id: number
    quantity: number
}

export const updateUserCart = async (values: UpdateUserCartRequest) => {
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const userId = session?.user.id

    if (!userId) {
        throw new Error("User is not authenticated")
    }

    const { data, error } = await supabase
        .from("user_cart")
        .update({
            quantity: values.quantity,
        })
        .eq("user_id", userId)
        .eq("product_id", values.product_id)
        .single()

    if (error) {
        throw error
    }

    return data
}
