import { supabase } from "../../lib/supabase"
import { setUserInfo } from "../../storages/userStorage"

export const QUERY_KEY_USER = "user"

export const getUser = async () => {
    const {
        data: { user },
    } = await supabase.auth.getUser()

    setUserInfo({ email: user?.email })

    return user
}
