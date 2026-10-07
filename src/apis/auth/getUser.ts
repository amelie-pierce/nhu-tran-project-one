import { supabase } from "@/lib/supabase"
import { getUserInfo, setUserInfo } from "@/storages/userStorage"

export const QUERY_KEY_USER = "user"

export const getUser = async () => {
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const prevUserInfo = getUserInfo()
    const userInfo =
        user?.email === prevUserInfo.email
            ? prevUserInfo
            : { email: user?.email }

    setUserInfo(userInfo)

    return user
}
