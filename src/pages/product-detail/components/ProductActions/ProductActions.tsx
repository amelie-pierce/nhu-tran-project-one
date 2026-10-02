import { useState } from "react"
import type { Product } from "../../../../types/product"
import InputNumber from "../../../../components/ui/InputNumber/InputNumber"
import Button from "../../../../components/ui/Button/Button"
import { useProductAction } from "../../../../hooks/useProductAction"
import { useLocation } from "react-router"
import styles from "./ProductActions.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartShopping, faCreditCard } from "@fortawesome/free-solid-svg-icons"

type Props = {
    product: Product
}

const ProductActions = ({ product }: Props) => {
    const [quantity, setQuantity] = useState(1)
    const { handleProductAction } = useProductAction()
    const location = useLocation()

    return (
        <div className={styles["product-detail-actions"]}>
            <InputNumber
                value={quantity}
                onChange={setQuantity}
                className={styles["action-item"]}
            />
            <Button
                variant="secondary"
                onClick={() =>
                    handleProductAction({
                        type: "add",
                        items: [{ ...product, quantity }],
                        redirectTo: location.pathname + location.search,
                    })
                }
                className={styles["action-item"]}
                icon={<FontAwesomeIcon icon={faCartShopping} />}
            >
                Add to cart
            </Button>
            <Button
                onClick={() =>
                    handleProductAction({
                        type: "buy",
                        items: [{ ...product, quantity }],
                        redirectTo: "/checkout",
                    })
                }
                className={styles["action-item"]}
                icon={<FontAwesomeIcon icon={faCreditCard} />}
            >
                Buy now
            </Button>
        </div>
    )
}

export default ProductActions
