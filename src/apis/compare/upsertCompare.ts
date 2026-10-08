import { supabase } from "@/lib/supabase"
import { getCurrentUserId } from "../auth/getCurrentUserId"

export type UpsertUserCompareRequest = {
    product_ids: number[]
}

export const upsertUserCompare = async (values: UpsertUserCompareRequest) => {
    const userId = await getCurrentUserId()

    if (!userId) {
        return null
    }

    const { data, error } = await supabase.from("user_compare").upsert(
        values.product_ids.map((product_id) => ({
            user_id: userId,
            product_id,
        }))
    )

    if (error) {
        throw error
    }

    return data
}
