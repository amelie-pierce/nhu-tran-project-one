import { supabase } from "@/lib/supabase"
import { getUser } from "../auth/getUser"
import type { UserCart } from "@/types/cart"

export type UpsertUserCartRequest = {
    product_id: number
    quantity: number
}

export const upsertUserCart = async (
    values: UpsertUserCartRequest
): Promise<UserCart[] | null> => {
    const user = await getUser()

    if (!user?.id) {
        return null
    }

    const { data, error } = await supabase
        .from("user_cart")
        .upsert(
            {
                user_id: user.id,
                product_id: values.product_id,
                quantity: values.quantity,
            },
            { onConflict: "user_id, product_id" }
        )
        .select("*")

    if (error) {
        throw error
    }

    return data
}
