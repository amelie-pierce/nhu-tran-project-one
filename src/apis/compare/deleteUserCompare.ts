import { supabase } from "@/lib/supabase"
import { getCurrentUserId } from "../auth/getCurrentUserId"

export const QUERY_KEY_USER_COMPARE = "user_compare"

export const deleteUserCompare = async (product_id: number) => {
    const userId = await getCurrentUserId()

    if (!userId) {
        return null
    }

    const { data, error } = await supabase
        .from("user_compare")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", product_id)

    if (error) {
        throw error
    }

    return data
}
