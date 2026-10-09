import { Button, Tag } from "@/components/ui"
import { getImgSizeWidth } from "@/utils/getImgSizeWidth"
import type { Product } from "@/types/product"
import { useProductAction } from "@/hooks/useProductAction"
import { transformImage } from "@/utils/transformImage"
import { useLocation, useNavigate } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faScaleBalanced,
    faCreditCard,
    faCartPlus,
} from "@fortawesome/free-solid-svg-icons"
import { useUserData } from "@/contexts/UserDataContext"
import { toVND } from "@/utils/toVND"
import styles from "./ProductItem.module.css"
import { useFeatureFlags } from "@/hooks/useFeatureFlags"

interface Props {
    product: Product
}

const ProductItem = ({ product }: Props) => {
    const { handleProductAction } = useProductAction()
    const { compareList, toggleCompareItem } = useUserData()
    const location = useLocation()
    const navigate = useNavigate()
    const { fallbackImg } = useFeatureFlags()

    return (
        <div
            key={product.id}
            className={styles["product-item-container"]}
            onClick={() => {
                navigate(`/product/${product.id}`)
            }}
        >
            <img
                src={transformImage(product.img_url || fallbackImg, 270)}
                srcSet={`
                    ${transformImage(product.img_url || fallbackImg, 160)} 160w,
                    ${transformImage(product.img_url || fallbackImg, 200)} 200w,
                    ${transformImage(product.img_url || fallbackImg, 270)} 270w
                    ${transformImage(product.img_url || fallbackImg, 500)} 500w
                `}
                sizes={getImgSizeWidth(160, 200, 270, 500)}
                alt={product.name}
                className={styles["product-item-image"]}
                loading="lazy"
            />
            <div className={styles["product-item-details"]}>
                <div className={styles["product-item-info"]}>
                    <div className={styles["product-item-tags"]}>
                        <span
                            className={`text-truncate ${styles["product-item-category"]}`}
                        >
                            {product?.category?.name}
                        </span>
                        <Tag
                            variant={
                                compareList.includes(product.id)
                                    ? "light-purple"
                                    : "white"
                            }
                            onClick={(e) => {
                                e.stopPropagation()
                                toggleCompareItem(product.id)
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faScaleBalanced}
                                className={styles["balance-icon"]}
                            />
                        </Tag>
                    </div>
                    <div className="bold text-truncate">{product.name}</div>
                    <div className={`bold ${styles["product-item-price"]}`}>
                        {toVND(product.price)}
                    </div>
                </div>
                <div className={styles["product-item-actions"]}>
                    <Button
                        variant="secondary"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleProductAction({
                                type: "add",
                                items: [{ ...product, quantity: 1 }],
                                redirectTo: location.pathname + location.search,
                            })
                        }}
                        icon={<FontAwesomeIcon icon={faCartPlus} />}
                        className={styles["product-item-action-button"]}
                    >
                        Add
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleProductAction({
                                type: "buy",
                                items: [{ ...product, quantity: 1 }],
                                redirectTo: "/checkout",
                            })
                        }}
                        icon={
                            <FontAwesomeIcon
                                icon={faCreditCard}
                                className="custom-credit-icon-btn"
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
