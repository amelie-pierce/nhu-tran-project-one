import { supabase } from "@/lib/supabase"
import { getCurrentUserId } from "../auth/getCurrentUserId"

export const QUERY_KEY_USER_COMPARE = "user_compare"

export type CreateUserCompareRequest = {
    product_id: number
}

export const createUserCompare = async (values: CreateUserCompareRequest) => {
    const userId = await getCurrentUserId()

    if (!userId) {
        return null
    }

    const { data, error } = await supabase.from("user_compare").insert({
        user_id: userId,
        product_id: values.product_id,
    })

    if (error) {
        throw error
    }

    return data
}
