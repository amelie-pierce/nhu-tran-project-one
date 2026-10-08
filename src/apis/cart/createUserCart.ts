import { supabase } from "@/lib/supabase"
import { getUser } from "../auth/getUser"

export type CreateUserCartRequest = {
    product_id: number
    quantity: number
}

export const createUserCart = async (values: CreateUserCartRequest) => {
    const user = await getUser()

    if (!user?.id) {
        return null
    }

    const { data, error } = await supabase.from("user_cart").insert({
        user_id: user?.id,
        product_id: values.product_id,
        quantity: values.quantity,
    })

    if (error) {
        throw error
    }

    return data
}
