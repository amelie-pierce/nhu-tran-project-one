import { supabase } from "../../lib/supabase"
import type { Product } from "../../types/product"

export const QUERY_KEY_PRODUCTS = "products"

export async function getListProduct(): Promise<Product[]> {
    const { data, error } = await supabase.from("product").select("*")

    if (error) {
        throw error
    }

    return data ?? []
}
