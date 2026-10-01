import { supabase } from "../../lib/supabase"
import type { Product } from "../../types/product"

export const QUERY_KEY_PRODUCTS = "products"

type GetListProductRequest = {
    page: number
    limit: number
}

type GetListProductResponse = {
    data: Product[]
    total: number
    totalPage: number
    currentPage: number
}

export async function getListProduct(
    params: GetListProductRequest
): Promise<GetListProductResponse> {
    const { page, limit } = params
    const from = (page - 1) * limit
    const to = page * limit - 1

    const { data, error, count } = await supabase
        .from("product")
        .select(
            `
            *,
            category (
                name
            )
            `,
            { count: "exact" }
        )
        .range(from, to)

    if (error) {
        throw error
    }

    const total = count ?? 0
    const totalPage = Math.ceil(total / limit)

    return {
        data: data ?? [],
        total,
        totalPage,
        currentPage: page,
    }
}
