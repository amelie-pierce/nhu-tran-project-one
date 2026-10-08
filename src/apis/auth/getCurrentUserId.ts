import { supabase } from "@/lib/supabase"

export const QUERY_KEY_USER = "user"

export const getCurrentUserId = async () => {
    const {
        data: { session },
    } = await supabase.auth.getSession()

    return session?.user.id
}
