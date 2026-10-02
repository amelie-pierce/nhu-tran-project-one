import Tag from "../../../../components/ui/Tag/Tag"
import type { OrderProduct } from "../../../../types/order"
import styles from "./OrderItem.module.css"

type Props = {
    product: OrderProduct
}

const OrderItem = ({ product }: Props) => {
    return (
        <div className={styles["order-item-container"]}>
            <img
                src={product.img_url || ""}
                alt={product.name}
                className={styles["order-item-image"]}
            />
            <div className={styles["order-item-details"]}>
                <span className="bold">{product.name}</span>
                <span>{product.price}</span>
                <Tag variant="light-pink">x {product.quantity}</Tag>
            </div>
            <span className="bold">{product.price * product.quantity}</span>
        </div>
    )
}

export default OrderItem
