import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons"
import Tag from "../../../../components/ui/Tag/Tag"
import type { Product } from "../../../../types/product"
import styles from "./ProductInfo.module.css"
import { useState } from "react"
import { toggleCompare } from "../../../../storages/compareStorage"
import ProductActions from "../ProductActions/ProductActions"
import type { Ingredient } from "../../../../types/ingredient"

type Props = {
    product: Product
}

const ProductInfo = ({ product }: Props) => {
    const [listCompare, setListCompare] = useState<number[]>([])

    return (
        <div className={styles["product-detail-container"]}>
            <img
                src={product.img_url || ""}
                alt="Product Image"
                className={styles["product-detail-image"]}
            />
            <div className={styles["product-detail"]}>
                <div className={styles["product-detail-info"]}>
                    <div className={styles["product-detail-tags"]}>
                        <Tag variant="light-pink">
                            {product?.category?.name}
                        </Tag>
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
                    <div className="title bold">{product.name}</div>
                    <div className={`title bold ${styles["product-detail-price"]}`}>
                        {product.price}
                    </div>
                    <div className={styles["product-detail-description"]}>
                        {product.description}
                    </div>
                    <div className={styles["product-ingredients"]}>
                        {product?.ingredient?.map((item: Ingredient) => (
                            <Tag key={item.id}>{item.name}</Tag>
                        ))}
                    </div>
                </div>
                <ProductActions product={product} />
            </div>
        </div>
    )
}

export default ProductInfo
