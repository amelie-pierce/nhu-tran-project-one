import InputNumber from "../../../../components/ui/InputNumber/InputNumber"
import { useState } from "react"
import { updateCart } from "../../../../storages/cartStorage"
import type { CartProduct } from "../../../../types/cart"
import styles from "./CartItem.module.css"
import Button from "../../../../components/ui/Button/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

type Props = {
    cart: CartProduct
    onRemove: () => void
}

const CartItem = ({ cart, onRemove }: Props) => {
    const [quantity, setQuantity] = useState(cart.quantity)

    const handleChangeQuantity = (value: number) => {
        setQuantity(value)
        updateCart(cart.id || 0, value)
    }

    return (
        <div key={cart.id} className={styles["cart-item-container"]}>
            <input type="checkbox" />
            <img
                src={cart.img_url || ""}
                alt={cart.name}
                className={styles["cart-item-image"]}
            />
            <div className={styles["cart-item-info-container"]}>
                <p className="bold">{cart.name}</p>
                <p>{cart.price || 0}</p>
                <InputNumber
                    value={quantity}
                    onChange={handleChangeQuantity}
                    className={styles["input-quantity"]}
                />
            </div>
            <p>{(cart.price || 0) * quantity}</p>
            <Button
                variant="secondary"
                icon={<FontAwesomeIcon icon={faTrash} />}
                onClick={onRemove}
            />
        </div>
    )
}

export default CartItem
