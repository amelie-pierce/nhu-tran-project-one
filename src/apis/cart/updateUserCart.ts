import { supabase } from "@/lib/supabase"
import { getUser } from "../auth/getUser"

export type UpdateUserCartRequest = {
    product_id: number
    quantity: number
}

export const updateUserCart = async (values: UpdateUserCartRequest) => {
    const user = await getUser()

    if (!user?.id) {
        return null
    }

    const { data, error } = await supabase
        .from("user_cart")
        .update({
            quantity: values.quantity,
        })
        .eq("user_id", user?.id)
        .eq("product_id", values.product_id)
        .select("*")

    if (error) {
        throw error
    }

    return data
}
