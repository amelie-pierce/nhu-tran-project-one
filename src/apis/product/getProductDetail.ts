import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/product"

export const QUERY_KEY_PRODUCT_DETAIL = "product_detail"

export type GetProductDetailParams = {
    id?: number
}

export async function getProductDetail(
    params: GetProductDetailParams
): Promise<Product> {
    const { data, error } = await supabase
        .from("product")
        .select(
            `
            *,
            category (
                name
            ),
            ingredient(
                id,
                name
            )
            `
        )
        .eq("id", params.id)
        .single()

    if (error) {
        throw error
    }

    return data
}
