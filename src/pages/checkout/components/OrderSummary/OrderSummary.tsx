import { useNavigate } from "react-router"
import { toVND } from "@/utils/toVND"
import { Button, Tag } from "@/components/ui"
import type { OrderProduct } from "@/types/order"
import { OrderItem } from "@/pages/checkout/components"
import styles from "./OrderSummary.module.css"

type Props = {
    orderItems: OrderProduct[]
    isPending?: boolean
}

const SHIPPING_FEE = 0

const OrderSummary = ({ orderItems, isPending }: Props) => {
    const navigate = useNavigate()

    const subTotal = orderItems.reduce(
        (total, item) => total + item.quantity * item.price,
        0
    )

    return (
        <div className={styles["order-summary-container"]}>
            <div
                className={`${styles["order-items-container"]} scrollbar-hidden`}
            >
                {orderItems.map((item) => (
                    <OrderItem key={item.id} product={item} />
                ))}
            </div>
            <div className={styles["summary-container"]}>
                <div className={styles["info-container"]}>
                    <div className={styles["info"]}>
                        <span className="bold">Sub Total</span>
                        <span className="bold">{toVND(subTotal)}</span>
                    </div>
                    <div className={styles["info"]}>
                        <span className="bold">Shipping</span>
                        <Tag variant="green">Freeship</Tag>
                    </div>
                </div>
                <div className={styles["info-container"]}>
                    <div className={styles["info"]}>
                        <span className="bold">Total</span>
                        <span className="bold">
                            {toVND(subTotal + SHIPPING_FEE)}
                        </span>
                    </div>
                </div>

                <Button
                    type="submit"
                    className={styles["checkout-button"]}
                    onClick={() => {
                        navigate("/payment", { state: { status: "success" } })
                    }}
                    disabled={isPending}
                >
                    Place an order
                </Button>
            </div>
        </div>
    )
}

export default OrderSummary
