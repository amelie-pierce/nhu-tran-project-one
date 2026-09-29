import { supabase } from "../../lib/supabase";
import type { Product } from "../../types/product";

export async function getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from("product")
        .select("*");

    if (error) {
        throw new Error(error.message);
    }

    return data ?? [];
}