import { Tag } from "@/components/ui"
import type { OrderProduct } from "@/types/order"
import { toVND } from "@/utils/toVND"
import styles from "./OrderItem.module.css"
import { useFeatureFlags } from "@/hooks/useFeatureFlags"
import { getImgSizeWidth } from "@/utils/getImgSizeWidth"
import { transformImage } from "@/utils/transformImage"

type Props = {
    product: OrderProduct
}

const OrderItem = ({ product }: Props) => {
    const { fallbackImg } = useFeatureFlags()
    return (
        <div className={styles["order-item-container"]}>
            <img
                src={product.img_url || fallbackImg}
                srcSet={`
                    ${transformImage(product.img_url || fallbackImg, 50)} 50w,
                    ${transformImage(product.img_url || fallbackImg, 100)} 100w,
                    ${transformImage(product.img_url || fallbackImg, 200)} 200w,
                `}
                sizes={getImgSizeWidth(50, 100, 100, 200)}
                alt={product.name}
                className={styles["order-item-image"]}
            />
            <div className={styles["order-item-details"]}>
                <span className="bold text-truncate">{product.name}</span>
                <span>{toVND(product.price)}</span>
                <Tag variant="light-pink">x {product.quantity}</Tag>
            </div>
            <span className="bold">
                {toVND(product.price * product.quantity)}
            </span>
        </div>
    )
}

export default OrderItem
