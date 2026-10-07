import flagsmith from "@/lib/flagsmith"

export const isDBCartEnabled = flagsmith.hasFeature("db_cart")
export const isDBCompareEnabled = flagsmith.hasFeature("db_compare")
export const isSignupEnabled = flagsmith.hasFeature("signup")
export const maxQtyPerProduct = (flagsmith.getValue("max_qty_per_product") ||
    1) as number
export const fallbackImg = (flagsmith.getValue("fallback_img") || "") as string
