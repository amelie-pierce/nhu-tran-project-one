import InputNumber from "../../../../components/ui/InputNumber/InputNumber"
import { useState } from "react"
import type { CartProduct } from "../../../../types/cart"
import styles from "./CartItem.module.css"
import Button from "../../../../components/ui/Button/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { useUserData } from "../../../../contexts/UserDataContext"
import { MAX_QUANTITY } from "../../../../constants"
import { toVND } from "../../../../utils/toVND"
import { useScreenWidth } from "../../../../hooks/useScreenWidth"

type Props = {
    item: CartProduct
    onRemove: () => void
    onToggleCheck: (item: CartProduct) => void
}

const CartItem = ({ item, onRemove, onToggleCheck }: Props) => {
    const { updateCartList } = useUserData()
    const screenWidth = useScreenWidth()

    const handleChangeQuantity = (value: number) => {
        updateCartList(item.id || 0, value, false)
    }

    return (
        <div className={styles["cart-item-container"]}>
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
                <div className="bold text-truncate">{item.name}</div>
                <div>{toVND(item.price)}</div>
                <InputNumber
                    value={item.quantity}
                    max={MAX_QUANTITY}
                    onChange={handleChangeQuantity}
                    className={styles["input-quantity"]}
                />
            </div>
            {screenWidth > 1024 && (
                <p>{toVND((item.price || 0) * (item.quantity || 0))}</p>
            )}
            <Button
                variant="secondary"
                icon={<FontAwesomeIcon icon={faTrash} />}
                onClick={onRemove}
            />
        </div>
    )
}

export default CartItem
