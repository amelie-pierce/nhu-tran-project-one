import { supabase } from "@/lib/supabase"
import { getUser } from "../auth/getUser"
import type { Contact } from "@/types/contact"

export const upsertUserContact = async (values: Partial<Contact>) => {
    const user = await getUser()

    if (!user?.id) {
        return null
    }

    const { data, error } = await supabase.from("user_contact").upsert(
        {
            ...values,
            user_id: user.id,
        },
        { onConflict: "user_id" }
    )

    if (error) {
        throw error
    }

    return data
}
