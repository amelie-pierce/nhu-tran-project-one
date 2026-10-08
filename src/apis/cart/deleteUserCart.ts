import { supabase } from "@/lib/supabase"
import { getUser } from "../auth/getUser"

export const deleteUserCart = async (product_id: number) => {
    const user = await getUser()

    if (!user?.id) {
        return null
    }

    const { data, error } = await supabase
        .from("user_cart")
        .delete()
        .eq("user_id", user?.id)
        .eq("product_id", product_id)

    if (error) {
        throw error
    }

    return data
}
