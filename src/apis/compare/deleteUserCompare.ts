import { supabase } from "@/lib/supabase"
import { getUser } from "../auth/getUser"

export const deleteUserCompare = async (product_id?: number) => {
    const user = await getUser()

    if (!user?.id) {
        return null
    }

    const query = supabase.from("user_compare").delete().eq("user_id", user?.id)

    if (product_id) {
        query.eq("product_id", product_id)
    }

    const { data, error } = await query

    if (error) {
        throw error
    }

    return data
}
