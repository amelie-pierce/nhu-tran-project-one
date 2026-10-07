import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { TextOverflow } from "@/components"
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons"
import { Tag } from "@/components/ui"
import type { Product } from "@/types/product"
import type { Ingredient } from "@/types/ingredient"
import { useUserData } from "@/contexts/UserDataContext"
import { toVND } from "@/utils/toVND"
import { useFeatureFlags } from "@/hooks/useFeatureFlags"
import { ProductActions } from "@/pages/product-detail/components"
import styles from "./ProductInfo.module.css"

type Props = {
    product: Product
}

const ProductInfo = ({ product }: Props) => {
    const { compareList, toggleCompareItem } = useUserData()
    const { fallbackImg } = useFeatureFlags()

    return (
        <div className={styles["product-detail-container"]}>
            <img
                src={product.img_url || fallbackImg}
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
                    <TextOverflow
                        text={product.description || ""}
                        className={styles["product-detail-description"]}
                    />
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
