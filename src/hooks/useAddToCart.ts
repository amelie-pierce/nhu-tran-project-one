import { useToast } from "../components/ui/Toast/ToastContext"
import { getCart, addToCart } from "../storages/cartStorage"

const MAX_QUANTITY = 9

export const useAddToCart = () => {
    const { showToast } = useToast()

    const handleAddToCart = (productId: number, quantity: number) => {
        const cart = getCart()
        const itemInCart = cart.find((item) => item.id === productId)
        const quantityInCart = itemInCart?.quantity || 0
        const maxAddable = MAX_QUANTITY - quantityInCart

        if (quantity <= maxAddable) {
            addToCart(productId, quantity)
            showToast({
                message: "Added to cart successfully",
                variant: "success",
            })
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
        }
    }

    return {
        handleAddToCart,
    }
}
