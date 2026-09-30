import { supabase } from "../../lib/supabase"

export const QUERY_KEY_USER = "user"

export const getUser = async () => {
    const {
        data: { user },
    } = await supabase.auth.getUser()

    return user
}
