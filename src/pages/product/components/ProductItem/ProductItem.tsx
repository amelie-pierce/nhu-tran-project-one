import Button from "../../../../components/ui/Button/Button"
import Tag from "../../../../components/ui/Tag/Tag"
import styles from "./ProductItem.module.css"
import type { Product } from "../../../../types/product"
import { toggleCompare } from "../../../../storages/compareStorage"
import { useProductAction } from "../../../../hooks/useProductAction"
import { useLocation } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faScaleBalanced,
    faCartShopping,
    faCreditCard,
} from "@fortawesome/free-solid-svg-icons"

interface Props {
    product: Product
    listCompare: number[]
    setListCompare: (listCompare: number[]) => void
}

const ProductItem = ({ product, setListCompare, listCompare }: Props) => {
    const { handleProductAction } = useProductAction()
    const location = useLocation()

    return (
        <div key={product.id} className={styles["product-item-container"]}>
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
                                listCompare.includes(product.id)
                                    ? "light-purple"
                                    : "white"
                            }
                            onClick={() =>
                                setListCompare(toggleCompare(product.id))
                            }
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
                        icon={
                            <FontAwesomeIcon
                                icon={faCartShopping}
                                className={styles["action-icon"]}
                            />
                        }
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
                        icon={
                            <FontAwesomeIcon
                                icon={faCreditCard}
                                className={styles["action-icon"]}
                            />
                        }
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
