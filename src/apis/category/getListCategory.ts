import { supabase } from "../../lib/supabase"
import type { Category } from "../../types/category"

export const QUERY_KEY_CATEGORIES = "categories"

export async function getListCategory(): Promise<Category[]> {
    const { data, error } = await supabase.from("category").select("*")

    if (error) {
        throw error
    }

    return data ?? []
}
