import { Button } from "@/components/ui"
import { useUserData } from "@/contexts/UserDataContext"
import type { ReactVirtualizer } from "@tanstack/react-virtual"
import type { Product } from "@/types/product"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FALLBACK_IMAGE } from "@/constants"
import { useProductAction } from "@/hooks/useProductAction"
import styles from "./VirtualColumn.module.css"
import globalStyles from "../VirtualArea/VirtualArea.module.css"

type Props = {
    columnVirtualizer: ReactVirtualizer<HTMLDivElement, Element>
    products?: Product[]
    size: {
        headerHeight: number
        cellHeight: number
        cellWidth: number
    }
    screenWidth: number
}

const VirtualColumn = ({
    columnVirtualizer,
    products,
    size,
    screenWidth,
}: Props) => {
    const { toggleCompareItem } = useUserData()
    const { handleProductAction } = useProductAction()

    return (
        <div className={styles["sticky-header"]}>
            {columnVirtualizer?.getVirtualItems()?.map((column) => {
                const product = products?.[column.index]
                return (
                    <div
                        key={column.key}
                        className={`${globalStyles.cell} ${styles["header-cell"]}`}
                        style={{
                            left: column.start + size.cellWidth,
                        }}
                    >
                        <div className={styles["product-info"]}>
                            <img
                                src={product?.img_url || FALLBACK_IMAGE}
                                alt="product-img"
                                className={styles["product-img"]}
                            />

                            <div
                                className={`bold text-truncate ${styles["product-name"]}`}
                            >
                                {product?.name}
                            </div>
                        </div>
                        <div className={styles["product-actions"]}>
                            <Button
                                variant="border-black"
                                icon={<FontAwesomeIcon icon={faTrash} />}
                                className={styles["button-action"]}
                                onClick={() => {
                                    toggleCompareItem(Number(column.key))
                                }}
                            >
                                {screenWidth > 1024 ? "Remove" : null}
                            </Button>
                            <Button
                                variant="secondary"
                                icon={<FontAwesomeIcon icon={faCartPlus} />}
                                className={styles["button-action"]}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleProductAction({
                                        type: "add",
                                        items: [
                                            {
                                                ...product,
                                                quantity: 1,
                                            },
                                        ],
                                        redirectTo:
                                            location.pathname + location.search,
                                    })
                                }}
                            >
                                {screenWidth > 1024 ? "Add" : null}
                            </Button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default VirtualColumn
