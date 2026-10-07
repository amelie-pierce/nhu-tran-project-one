import { supabase } from "@/lib/supabase"
import { getUserInfoStorage, setUserInfoStorage } from "@/storages/userStorage"

export const QUERY_KEY_USER = "user"

export const getUser = async () => {
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const prevUserInfo = getUserInfoStorage()
    const userInfo =
        user?.email === prevUserInfo.email
            ? prevUserInfo
            : { email: user?.email }

    setUserInfoStorage(userInfo)

    return user
}
