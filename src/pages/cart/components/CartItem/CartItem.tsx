import InputNumber from "../../../../components/ui/InputNumber/InputNumber"
import { useEffect, useState } from "react"
import type { CartProduct } from "../../../../types/cart"
import styles from "./CartItem.module.css"
import Button from "../../../../components/ui/Button/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { useUserData } from "../../../../contexts/UserDataContext"
import { MAX_QUANTITY } from "../../../../constants"
import { toVND } from "../../../../utils/toVND"

type Props = {
    item: CartProduct
    onRemove: () => void
    onToggleCheck: (item: CartProduct) => void
}

const CartItem = ({ item, onRemove, onToggleCheck }: Props) => {
    const [quantity, setQuantity] = useState(item.quantity)
    const { updateCartList } = useUserData()

    const handleChangeQuantity = (value: number) => {
        setQuantity(value)
        updateCartList(item.id || 0, value, false)
    }

    return (
        <div key={item.id} className={styles["cart-item-container"]}>
            <input
                type="checkbox"
                checked={item.checked}
                onChange={() => onToggleCheck(item)}
            />
            <img
                src={item.img_url || ""}
                alt={item.name}
                className={styles["cart-item-image"]}
            />
            <div className={styles["cart-item-info-container"]}>
                <p className="bold text-truncate">{item.name}</p>
                <p>{toVND(item.price)}</p>
                <InputNumber
                    value={quantity}
                    max={MAX_QUANTITY}
                    onChange={handleChangeQuantity}
                    className={styles["input-quantity"]}
                />
            </div>
            <p>{(item.price || 0) * quantity}</p>
            <Button
                variant="secondary"
                icon={<FontAwesomeIcon icon={faTrash} />}
                onClick={onRemove}
            />
        </div>
    )
}

export default CartItem
