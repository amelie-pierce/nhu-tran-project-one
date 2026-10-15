import { InputNumber, Button } from "@/components/ui"
import { useNavigate } from "react-router"
import type { CartProduct } from "@/types/cart"
import styles from "./CartItem.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { useUserData } from "@/contexts/UserDataContext"
import { toVND } from "@/utils/toVND"
import { useScreenWidth } from "@/hooks/useScreenWidth"
import { useFeatureFlags } from "@/hooks/useFeatureFlags"
import { getImgSizeWidth } from "@/utils/getImgSizeWidth"
import { transformImage } from "@/utils/transformImage"
import React, { useState } from "react"

type Props = {
    item: CartProduct
    onRemove: (id: number) => void
    onToggleCheck: (item: CartProduct) => void
}

const CartItem = React.memo(
    ({ item, onRemove, onToggleCheck }: Props) => {
        const { fallbackImg } = useFeatureFlags()
        const { updateCartList } = useUserData()
        const { maxQtyPerProduct } = useFeatureFlags()
        const screenWidth = useScreenWidth()
        const navigate = useNavigate()
        const [isDeleting, setIsDeleting] = useState(false)

        const handleChangeQuantity = (value: number | string) => {
            updateCartList(item.id || 0, Number(value), true)
        }

        const handleRemove = () => {
            setIsDeleting(true)
            onRemove(item.id || 0)
        }

        return (
            <div className={styles["cart-item-container"]}>
                <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => onToggleCheck(item)}
                />
                <img
                    src={item.img_url || fallbackImg}
                    srcSet={`
                        ${transformImage(item.img_url || fallbackImg, 50)} 50w,
                        ${transformImage(item.img_url || fallbackImg, 100)} 100w,
                        ${transformImage(item.img_url || fallbackImg, 200)} 200w,
                    `}
                    sizes={getImgSizeWidth(50, 100, 100, 200)}
                    alt={item.name}
                    className={styles["cart-item-image"]}
                    onClick={() => {
                        navigate(`/product/${item.id}`)
                    }}
                />
                <div className={styles["cart-item-info-container"]}>
                    <div className="bold text-truncate">{item.name}</div>
                    <div>{toVND(item.price)}</div>
                    <InputNumber
                        value={item.quantity}
                        max={maxQtyPerProduct}
                        onChange={handleChangeQuantity}
                        className={styles["input-quantity"]}
                        allowClear={false}
                    />
                </div>
                {screenWidth > 1024 && (
                    <p>{toVND((item.price || 0) * (item.quantity || 0))}</p>
                )}
                <Button
                    variant="secondary"
                    icon={<FontAwesomeIcon icon={faTrash} />}
                    onClick={handleRemove}
                    disabled={isDeleting}
                />
            </div>
        )
    },
    (prevProps, nextProps) => {
        return (
            prevProps.item.id === nextProps.item.id &&
            prevProps.item.quantity === nextProps.item.quantity &&
            prevProps.item.checked === nextProps.item.checked &&
            prevProps.item.name === nextProps.item.name &&
            prevProps.item.price === nextProps.item.price &&
            prevProps.item.img_url === nextProps.item.img_url
        )
    }
)

export default CartItem
