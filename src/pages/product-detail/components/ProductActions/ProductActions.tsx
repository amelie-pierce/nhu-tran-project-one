import { useCallback, useState, useMemo } from "react"
import type { Product } from "../../../../types/product"
import { getCart, addToCart } from "../../../../storages/cartStorage"
import { useToast } from "../../../../components/ui/Toast/ToastContext"
import InputNumber from "../../../../components/ui/InputNumber/InputNumber"
import Button from "../../../../components/ui/Button/Button"

type Props = {
    product?: Product
}

const ProductActions = ({ product }: Props) => {
    const [quantity, setQuantity] = useState(1)
    const cart = getCart()
    const { showToast } = useToast()

    const quantityInCart = useMemo(() => {
        const itemInCart = cart?.find((item) => item.id === product?.id)
        return itemInCart?.quantity || 0
    }, [cart])

    const handleAddToCart = useCallback(() => {
        const maxAddable = 9 - quantityInCart
        if (quantity <= maxAddable) {
            showToast({
                message: "Added to cart successfully",
                variant: "success",
            })
            if (product?.id) {
                addToCart(product?.id, quantity)
            }
            return
        }
        if (maxAddable === 0) {
            showToast({
                message:
                    "Your cart already contains the maximum quantity for this product.",
                variant: "error",
            })
            return
        }
        if (quantity > maxAddable) {
            showToast({
                message: `Your cart already has ${quantityInCart} items. You can add up to ${maxAddable} more.`,
                variant: "warning",
            })
            return
        }
    }, [quantityInCart, quantity])

    return (
        <>
            <InputNumber value={quantity} onChange={setQuantity} />
            <Button onClick={handleAddToCart}>Add to Cart</Button>
            <Button>Buy</Button>
        </>
    )
}

export default ProductActions
