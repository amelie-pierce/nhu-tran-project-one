import { supabase } from "@/lib/supabase"
import { getUser } from "../auth/getUser"
import type { UserCart } from "@/types/cart"

export const deleteUserCart = async (
    product_ids: number[]
): Promise<UserCart[] | null> => {
    const user = await getUser()

    if (!user?.id) {
        return null
    }

    const { data, error } = await supabase
        .from("user_cart")
        .delete()
        .eq("user_id", user?.id)
        .in("product_id", product_ids)
        .select("*")

    if (error) {
        throw error
    }

    return data
}
