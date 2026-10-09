import { supabase } from "@/lib/supabase"
import { getUser } from "../auth/getUser"

export type CreateUserCompareRequest = {
    product_id: number
}

export const createUserCompare = async (values: CreateUserCompareRequest) => {
    const user = await getUser()

    if (!user?.id) {
        return null
    }

    const { data, error } = await supabase
        .from("user_compare")
        .insert({
            user_id: user?.id,
            product_id: values.product_id,
        })
        .select("*")

    if (error) {
        throw error
    }

    return data
}
