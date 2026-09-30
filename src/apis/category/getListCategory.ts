import { supabase } from "../../lib/supabase"
import type { Category } from "../../types/category"

export async function getListCategory(): Promise<Category[]> {
    const { data, error } = await supabase.from("category").select("*")

    if (error) {
        throw new Error(error.message)
    }

    return data ?? []
}
