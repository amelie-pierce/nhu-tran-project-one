import { supabase } from "@/lib/supabase"

export const QUERY_KEY_USER_CART = "user_cart"

export type CreateUserCartRequest = {
    product_id: number
    quantity: number
}

export const createUserCart = async (values: CreateUserCartRequest) => {
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const userId = session?.user.id

    const { data, error } = await supabase
        .from("user_cart")
        .insert({
            user_id: userId,
            product_id: values.product_id,
            quantity: values.quantity,
        })
        .single()

    if (error) {
        throw error
    }

    return data
}
