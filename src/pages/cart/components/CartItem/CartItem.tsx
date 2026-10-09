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

type Props = {
    item: CartProduct
    onRemove: () => void
    onToggleCheck: (item: CartProduct) => void
}

const CartItem = ({ item, onRemove, onToggleCheck }: Props) => {
    const { fallbackImg } = useFeatureFlags()
    const { updateCartList } = useUserData()
    const { maxQtyPerProduct } = useFeatureFlags()
    const screenWidth = useScreenWidth()
    const navigate = useNavigate()

    const handleChangeQuantity = (value: number | string) => {
        updateCartList(item.id || 0, Number(value), false)
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
