import type { Product } from "@/types/product"
import { toVND } from "@/utils/toVND"

export const getBasicInfoValue = (
    key: string,
    product?: Product
): { value: string; label: string } => {
    switch (key) {
        case "price":
            return { value: toVND(product?.price), label: "Price" }
        case "category":
            return {
                value: product?.category?.name ?? "",
                label: "Category",
            }
        default:
            return { value: key, label: key }
    }
}
