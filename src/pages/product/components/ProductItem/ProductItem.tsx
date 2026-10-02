import Button from "../../../../components/ui/Button/Button"
import Tag from "../../../../components/ui/Tag/Tag"
import styles from "./ProductItem.module.css"
import type { Product } from "../../../../types/product"
import { useProductAction } from "../../../../hooks/useProductAction"
import { useLocation, useNavigate } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faScaleBalanced,
    faCartShopping,
    faCreditCard,
} from "@fortawesome/free-solid-svg-icons"
import { useUserData } from "../../../../contexts/UserDataContext"

interface Props {
    product: Product
}

const ProductItem = ({ product }: Props) => {
    const { handleProductAction } = useProductAction()
    const { compareList, toggleCompareItem } = useUserData()
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <div
            key={product.id}
            className={styles["product-item-container"]}
            onClick={() => {
                navigate(`/product/${product.id}`)
            }}
        >
            <img
                src={product.img_url || ""}
                alt={product.name}
                className={styles["product-item-image"]}
            />
            <div className={styles["product-item-details"]}>
                <div className={styles["product-item-info"]}>
                    <div className={styles["product-item-tags"]}>
                        <span className={styles["product-item-category"]}>
                            {product?.category?.name}
                        </span>
                        <Tag
                            variant={
                                compareList.includes(product.id)
                                    ? "light-purple"
                                    : "white"
                            }
                            onClick={() => toggleCompareItem(product.id)}
                        >
                            <FontAwesomeIcon
                                icon={faScaleBalanced}
                                className={styles["balance-icon"]}
                            />
                        </Tag>
                    </div>
                    <div className="bold text-truncate">{product.name}</div>
                    <div className={`bold ${styles["product-item-price"]}`}>
                        {product.price}
                    </div>
                </div>
                <div className={styles["product-item-actions"]}>
                    <Button
                        variant="secondary"
                        onClick={() =>
                            handleProductAction({
                                type: "add",
                                productId: product.id,
                                quantity: 1,
                                redirectTo: location.pathname + location.search,
                            })
                        }
                        icon={<FontAwesomeIcon icon={faCartShopping} />}
                        className={styles["product-item-action-button"]}
                    >
                        Add
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
                        icon={<FontAwesomeIcon icon={faCreditCard} />}
                        className={styles["product-item-action-button"]}
                    >
                        Buy
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProductItem
