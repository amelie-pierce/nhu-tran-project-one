import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons"
import Tag from "../../../../components/ui/Tag/Tag"
import type { Product } from "../../../../types/product"
import styles from "./ProductInfo.module.css"
import ProductActions from "../ProductActions/ProductActions"
import type { Ingredient } from "../../../../types/ingredient"
import { useUserData } from "../../../../contexts/UserDataContext"
import { FALLBACK_IMAGE } from "../../../../constants"
import { toVND } from "../../../../utils/toVND"

type Props = {
    product: Product
}

const ProductInfo = ({ product }: Props) => {
    const { compareList, toggleCompareItem } = useUserData()

    return (
        <div className={styles["product-detail-container"]}>
            <img
                src={product.img_url || FALLBACK_IMAGE}
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
                    <div className="title bold">{product.name}</div>
                    <div
                        className={`title bold ${styles["product-detail-price"]}`}
                    >
                        {toVND(product.price)}
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
