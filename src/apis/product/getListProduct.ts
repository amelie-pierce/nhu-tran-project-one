import { supabase } from "../../lib/supabase"
import type { Product } from "../../types/product"

export const QUERY_KEY_PRODUCTS = "products"

type GetListProductRequest = {
    page: number
    limit: number
    category_id: number
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
    const from = (params.page - 1) * params.limit
    const to = params.page * params.limit - 1

    const query = supabase
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

    if (!!params.category_id) {
        query.filter("id", "in", `(${params.category_id})`)
    }

    const { data, error, count } = await query

    if (error) {
        throw error
    }

    const total = count ?? 0
    const totalPage = Math.ceil(total / params.limit)

    return {
        data: data ?? [],
        total,
        totalPage,
        currentPage: params.page,
    }
}
