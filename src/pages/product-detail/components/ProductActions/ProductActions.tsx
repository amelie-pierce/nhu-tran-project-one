import { useState } from "react"
import type { Product } from "@/types/product"
import { InputNumber, Button } from "@/components/ui"
import { useProductAction } from "@/hooks/useProductAction"
import { useLocation } from "react-router"
import styles from "./ProductActions.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartPlus, faCreditCard } from "@fortawesome/free-solid-svg-icons"
import { useFeatureFlags } from "@/hooks/useFeatureFlags"

type Props = {
    product: Product
}

const ProductActions = ({ product }: Props) => {
    const [quantity, setQuantity] = useState<number | string>(1)
    const { handleProductAction } = useProductAction()
    const location = useLocation()
    const { maxQtyPerProduct } = useFeatureFlags()

    return (
        <div className={styles["product-detail-actions"]}>
            <InputNumber
                value={quantity}
                max={maxQtyPerProduct}
                onChange={setQuantity}
                className={styles["action-item"]}
            />
            <Button
                variant="secondary"
                onClick={() =>
                    handleProductAction({
                        type: "add",
                        items: [{ ...product, quantity: Number(quantity) }],
                        redirectTo: location.pathname + location.search,
                    })
                }
                className={styles["action-item"]}
                icon={<FontAwesomeIcon icon={faCartPlus} />}
            >
                Add to cart
            </Button>
            <Button
                onClick={() =>
                    handleProductAction({
                        type: "buy",
                        items: [{ ...product, quantity: Number(quantity) }],
                        redirectTo: "/checkout",
                    })
                }
                className={styles["action-item"]}
                icon={
                    <FontAwesomeIcon
                        icon={faCreditCard}
                        className="custom-credit-icon-btn"
                    />
                }
            >
                Buy now
            </Button>
        </div>
    )
}

export default ProductActions
