import { supabase } from "@/lib/supabase"
import { getUser } from "../auth/getUser"

export type UpsertUserCompareRequest = {
    product_ids: number[]
}

export const upsertUserCompare = async (values: UpsertUserCompareRequest) => {
    const user = await getUser()

    if (!user?.id) {
        return null
    }

    const { data, error } = await supabase
        .from("user_compare")
        .upsert(
            values.product_ids.map((product_id) => ({
                user_id: user?.id,
                product_id,
            })),
            { onConflict: "user_id, product_id" }
        )
        .select("*")

    if (error) {
        throw error
    }

    return data
}
