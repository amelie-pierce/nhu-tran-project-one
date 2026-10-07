import { supabase } from "@/lib/supabase"

export type SignUpRequest = {
    email: string
    password: string
}

export const signUp = async (values: SignUpRequest) => {
    console.log(JSON.stringify(values.email))
    const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
    })

    if (error) {
        throw error
    }

    return data
}
