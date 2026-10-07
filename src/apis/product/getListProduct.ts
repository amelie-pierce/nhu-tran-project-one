import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/product"

export const QUERY_KEY_PRODUCTS = "products"

type GetListProductRequest = {
    page: number
    limit: number
    category_id: number
    product_ids: number[]
    extra_fields: string[]
}

type GetListProductResponse = {
    data: Product[]
    total: number
    totalPage: number
    currentPage: number
}

export async function getListProduct(
    params: Partial<GetListProductRequest>
): Promise<GetListProductResponse> {
    let select = `*, category (name)`

    if (params?.extra_fields?.includes("ingredient")) {
        select += `, ingredient(id, name)`
    }

    const query = supabase.from("product").select(select, { count: "exact" })

    if (!!params.page && !!params.limit) {
        const from = (params.page - 1) * params.limit
        const to = params.page * params.limit - 1
        query.range(from, to)
    }

    if (!!params.category_id) {
        query.filter("category_id", "in", `(${params.category_id})`)
    }

    if (!!params.product_ids) {
        query.filter("id", "in", `(${params.product_ids?.join(",")})`)
    }

    const { data, error, count } = await query

    if (error) {
        throw error
    }

    const total = count ?? 0
    const totalPage = Math.ceil(total / (params.limit || 1))

    return {
        data: (data ?? []) as unknown as Product[],
        total,
        totalPage,
        currentPage: params.page || 1,
    }
}
