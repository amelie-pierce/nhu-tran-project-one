import { Tag } from "@/components/ui"
import type { OrderProduct } from "@/types/order"
import { FALLBACK_IMAGE } from "@/constants"
import { toVND } from "@/utils/toVND"
import styles from "./OrderItem.module.css"

type Props = {
    product: OrderProduct
}

const OrderItem = ({ product }: Props) => {
    return (
        <div className={styles["order-item-container"]}>
            <img
                src={product.img_url || FALLBACK_IMAGE}
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
