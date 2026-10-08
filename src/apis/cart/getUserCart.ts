import { supabase } from "@/lib/supabase"
import type { UserCart } from "@/types/cart"
import { getUser } from "../auth/getUser"

export const QUERY_KEY_USER_CART = "user_cart"

export const getUserCart = async (): Promise<UserCart[]> => {
    const user = await getUser()

    if (!user?.id) {
        return []
    }

    const { data, error } = await supabase
        .from("user_cart")
        .select(`*, product(*)`)
        .eq("user_id", user?.id)

    if (error) {
        throw error
    }

    return data ?? []
}
