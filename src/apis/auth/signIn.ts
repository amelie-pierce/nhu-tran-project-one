import { supabase } from "../../lib/supabase"

export type SignInRequest = {
    email: string
    password: string
}

export const signIn = async (values: SignInRequest) => {
    const { data, error } = await supabase.auth.signInWithPassword(values)

    if (error) {
        throw error
    }

    return data
}
