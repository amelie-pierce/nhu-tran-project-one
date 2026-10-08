import { supabase } from "@/lib/supabase"
import type { UserCompare } from "@/types/compare"
import { getUser } from "../auth/getUser"

export const QUERY_KEY_USER_COMPARE = "user_compare"

export const getUserCompare = async (): Promise<UserCompare[]> => {
    const user = await getUser()

    if (!user?.id) {
        return []
    }

    const { data, error } = await supabase
        .from("user_compare")
        .select("*")
        .eq("user_id", user?.id)

    if (error) {
        throw error
    }

    return data ?? []
}
