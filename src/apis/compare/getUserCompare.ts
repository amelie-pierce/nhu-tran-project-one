import { supabase } from "@/lib/supabase"
import type { UserCompare } from "@/types/compare"
import { getCurrentUserId } from "../auth/getCurrentUserId"

export const QUERY_KEY_USER_COMPARE = "user_compare"

export async function getUserCompare(): Promise<UserCompare[]> {
    const userId = await getCurrentUserId()

    if (!userId) {
        return []
    }

    const { data, error } = await supabase
        .from("user_compare")
        .select("*")
        .eq("user_id", userId)

    if (error) {
        throw error
    }

    return data ?? []
}
