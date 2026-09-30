import Button from "../../../../components/ui/Button/Button"
import Tag from "../../../../components/ui/Tag/Tag"
import type { Product } from "../../../../types/product"
import { addToCart } from "../../../../storages/cartStorage"
import { toggleCompare } from "../../../../storages/compareStorage"

interface Props {
    product: Product
}

const ProductItem = ({ product }: Props) => {
    return (
        <div key={product.id}>
            <div>{product.name}</div>
            <div>{product.price}</div>
            <Tag onClick={() => toggleCompare(product.id)}>Compare</Tag>
            <Button onClick={() => addToCart(product.id, 1)}>
                Add to Cart
            </Button>
        </div>
    )
}

export default ProductItem
