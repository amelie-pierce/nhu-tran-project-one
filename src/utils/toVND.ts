export const toVND = (price?: number) => {
    const VND = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    })
    return VND.format(price || 0).replace("₫", "đ")
}
