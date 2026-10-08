import { useNavigate } from "react-router"
import { toVND } from "@/utils/toVND"
import { Button } from "@/components/ui"
import type { CartProduct } from "@/types/cart"
import styles from "./TotalPrice.module.css"

type Props = {
    selectedItems: CartProduct[]
}

const TotalPrice = ({ selectedItems }: Props) => {
    const navigate = useNavigate()
    const totalPrice = selectedItems?.reduce(
        (total, item) => total + (item.price || 0) * (item.quantity || 1),
        0
    )

    return (
        <div className={`${styles.wrapper} section-padding`}>
            <div className={styles["total-container"]}>
                <span className="bold">Total</span>
                <span className="bold">{toVND(totalPrice)}</span>
            </div>
            <Button
                variant={!!selectedItems?.length ? "primary" : "border-black"}
                className={styles["buy-button"]}
                disabled={!selectedItems.length}
                onClick={() => {
                    navigate("/checkout", {
                        state: {
                            items: selectedItems,
                            selectedItemIds: selectedItems.map(
                                (item) => item.id
                            ),
                        },
                    })
                }}
            >
                Buy now
            </Button>
        </div>
    )
}

export default TotalPrice
