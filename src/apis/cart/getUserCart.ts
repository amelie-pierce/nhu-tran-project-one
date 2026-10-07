import { supabase } from "@/lib/supabase"
import type { UserCart } from "@/types/cart"

export const QUERY_KEY_USER_CART = "user_cart"

export async function getUserCart(): Promise<UserCart[]> {
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const userId = session?.user.id

    const { data, error } = await supabase
        .from("user_cart")
        .select(`*, product(*)`)
        .eq("user_id", userId)

    if (error) {
        throw error
    }

    return data ?? []
}
