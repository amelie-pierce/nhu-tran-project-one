import Button from "../../../../components/ui/Button/Button"
import type { CartProduct } from "../../../../types/cart"
import styles from "./TotalPrice.module.css"

type Props = {
    selectedProducts: CartProduct[]
}

const TotalPrice = ({ selectedProducts }: Props) => {
    const totalPrice = selectedProducts?.reduce(
        (total, item) => total + (item.price || 0) * (item.quantity || 1),
        0
    )

    return (
        <div className={styles.wrapper}>
            <div className={styles["total-container"]}>
                <span>Total</span>
                <span>{totalPrice}</span>
            </div>
            <Button className={styles["buy-button"]}>Buy now</Button>
        </div>
    )
}

export default TotalPrice
