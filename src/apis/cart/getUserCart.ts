import { supabase } from "@/lib/supabase"
import type { UserCart } from "@/types/cart"
import { getCurrentUserId } from "../auth/getCurrentUserId"

export const QUERY_KEY_USER_CART = "user_cart"

export async function getUserCart(): Promise<UserCart[]> {
    const userId = await getCurrentUserId()

    if (!userId) {
        return []
    }

    const { data, error } = await supabase
        .from("user_cart")
        .select(`*, product(*)`)
        .eq("user_id", userId)

    if (error) {
        throw error
    }

    return data ?? []
}
