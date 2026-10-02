import Button from "../../../../components/ui/Button/Button"
import Tag from "../../../../components/ui/Tag/Tag"
import type { OrderProduct } from "../../../../types/order"
import OrderItem from "../OrderItem/OrderItem"
import styles from "./OrderSummary.module.css"

type Props = {
    orderItems: OrderProduct[]
}

const SHIPPING_FEE = 0

const OrderSummary = ({ orderItems }: Props) => {
    const subTotal = orderItems.reduce(
        (total, item) => total + item.quantity * item.price,
        0
    )

    return (
        <div className={styles["order-summary-container"]}>
            <div className={styles["order-items-container"]}>
                {orderItems.map((item) => (
                    <div key={item.id}>
                        <OrderItem product={item} />
                    </div>
                ))}
            </div>
            <div className={styles["summary-container"]}>
                <div className={styles["info-container"]}>
                    <div className={styles["info"]}>
                        <span className="bold">Sub Total</span>
                        <span className="bold">{subTotal}</span>
                    </div>
                    <div className={styles["info"]}>
                        <span className="bold">Shipping</span>
                        <Tag variant="green">Freeship</Tag>
                    </div>
                </div>
                <div className={styles["info-container"]}>
                    <div className={styles["info"]}>
                        <span className="bold">Total</span>
                        <span className="bold">{subTotal + SHIPPING_FEE}</span>
                    </div>
                </div>

                <Button type="submit" className={styles["checkout-button"]}>
                    Place an order
                </Button>
            </div>
        </div>
    )
}

export default OrderSummary
