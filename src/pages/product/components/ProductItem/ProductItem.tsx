import Button from "../../../../components/ui/Button/Button"
import Tag from "../../../../components/ui/Tag/Tag"
import type { Product } from "../../../../types/product"
import { toggleCompare } from "../../../../storages/compareStorage"
import { useProductAction } from "../../../../hooks/useProductAction"
import { useLocation } from "react-router"

interface Props {
    product: Product
}

const ProductItem = ({ product }: Props) => {
    const { handleProductAction } = useProductAction()
    const location = useLocation()

    return (
        <div key={product.id}>
            <div>{product.name}</div>
            <div>{product.price}</div>
            <Tag onClick={() => toggleCompare(product.id)}>Compare</Tag>
            <Button
                onClick={() =>
                    handleProductAction({
                        type: "add",
                        productId: product.id,
                        quantity: 1,
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
                        quantity: 1,
                        redirectTo: "/checkout",
                    })
                }
            >
                Buy
            </Button>
        </div>
    )
}

export default ProductItem
