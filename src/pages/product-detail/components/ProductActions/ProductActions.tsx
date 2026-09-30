import { useState } from "react"
import type { Product } from "../../../../types/product"
import InputNumber from "../../../../components/ui/InputNumber/InputNumber"
import Button from "../../../../components/ui/Button/Button"
import { useProductAction } from "../../../../hooks/useProductAction"
import { useLocation } from "react-router"

type Props = {
    product: Product
}

const ProductActions = ({ product }: Props) => {
    const [quantity, setQuantity] = useState(1)
    const { handleProductAction } = useProductAction()
    const location = useLocation()

    return (
        <>
            <InputNumber value={quantity} onChange={setQuantity} />
            <Button
                onClick={() =>
                    handleProductAction({
                        type: "add",
                        productId: product.id,
                        quantity,
                        redirectTo: location.pathname + location.search,
                    })
                }
            >
                Add to Cart
            </Button>
            <Button
                onClick={() =>
                    handleProductAction({
                        type: "buy",
                        productId: product.id,
                        quantity,
                        redirectTo: "/checkout",
                    })
                }
            >
                Buy
            </Button>
        </>
    )
}

export default ProductActions
