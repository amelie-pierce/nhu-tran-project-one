import { supabase } from "@/lib/supabase"
import type { Contact } from "@/types/contact"
import { getUser } from "../auth/getUser"

export const QUERY_KEY_USER_CONTACT = "user_contact"

export const getUserContact = async (): Promise<Contact | null> => {
    const user = await getUser()

    if (!user?.id) {
        return null
    }

    const { data, error } = await supabase
        .from("user_contact")
        .select(`*`)
        .eq("user_id", user?.id)
        .maybeSingle()

    if (error) {
        throw error
    }

    return { ...data, email: user?.email }
}
