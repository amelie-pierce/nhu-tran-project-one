import { useFlags } from "@flagsmith/flagsmith/react"

export function useFeatureFlags() {
    const flags = useFlags([
        "db_cart",
        "db_compare",
        "signup",
        "max_qty_per_product",
        "fallback_img",
    ])

    return {
        isDBCartEnabled: flags.db_cart.enabled,
        isDBCompareEnabled: flags.db_compare.enabled,
        isSignupEnabled: flags.signup.enabled,
        maxQtyPerProduct: Number(flags.max_qty_per_product.value) || 1,
        fallbackImg: String(flags.fallback_img.value || ""),
    }
}
