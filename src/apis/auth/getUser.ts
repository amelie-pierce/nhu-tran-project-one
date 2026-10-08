import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export const QUERY_KEY_USER = "user"

export const getUser = async (): Promise<User | undefined> => {
    const {
        data: { session },
    } = await supabase.auth.getSession()

    return session?.user
}
