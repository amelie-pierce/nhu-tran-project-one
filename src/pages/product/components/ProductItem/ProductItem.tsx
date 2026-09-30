import Button from "../../../../components/ui/Button/Button"
import type { Product } from "../../../../types/product"
import { addToCart } from "../../../../utils/cartStorage"

interface Props {
    product: Product
}

const ProductItem = ({ product }: Props) => {
    return (
        <div key={product.id}>
            <div>{product.name}</div>
            <div>{product.price}</div>
            <Button onClick={() => addToCart(product.id, 1)}>
                Add to Cart
            </Button>
        </div>
    )
}

export default ProductItem
