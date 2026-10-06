import styles from "./VirtualArea.module.css"
import { useMemo, useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import type { Product } from "../../../../types/product"
import { FALLBACK_IMAGE } from "../../../../constants"
import Button from "../../../../components/ui/Button/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faCartPlus,
    faCheck,
    faTrash,
    faXmark,
} from "@fortawesome/free-solid-svg-icons"
import { toVND } from "../../../../utils/toVND"
import Loader from "../../../../components/ui/Loader/Loader"
import { useUserData } from "../../../../contexts/UserDataContext"
import { useProductAction } from "../../../../hooks/useProductAction"
import { OVERSCAN, BASIC_INFO } from "../../constants"
import { useScreenWidth } from "../../../../hooks/useScreenWidth"

type Props = {
    parentRef: React.RefObject<HTMLDivElement | null>
    products?: Product[]
    isLoading: boolean
    ingredients: string[]
}

const VirtualArea = ({
    parentRef,
    products,
    isLoading,
    ingredients,
}: Props) => {
    const { handleProductAction } = useProductAction()
    const { toggleCompareItem, removeAllCompareItems } = useUserData()
    const screenWidth = useScreenWidth()

    const size = useMemo(() => {
        if (screenWidth <= 480) {
            return {
                headerHeight: 120,
                cellHeight: 35,
                cellWidth: 120,
            }
        }
        if (screenWidth <= 1024) {
            return {
                headerHeight: 200,
                cellHeight: 45,
                cellWidth: 250,
            }
        }
        return {
            headerHeight: 220,
            cellHeight: 55,
            cellWidth: 300,
        }
    }, [screenWidth])

    const rowLabels = [...BASIC_INFO, ...ingredients]

    const rowVirtualizer = useVirtualizer({
        count: rowLabels?.length || 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => size.cellHeight,
        overscan: OVERSCAN,
        getItemKey: (index) => rowLabels?.[index] || "",
    })

    const columnVirtualizer = useVirtualizer({
        horizontal: true,
        count: products?.length || 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => size.cellWidth,
        overscan: OVERSCAN,
        getItemKey: (index) => products?.[index]?.id || 0,
    })

    const getBasicInfoValue = (
        key: string,
        product?: Product
    ): { value: string; label: string } => {
        switch (key) {
            case "price":
                return { value: toVND(product?.price), label: "Price" }
            case "category":
                return {
                    value: product?.category?.name ?? "",
                    label: "Category",
                }
            default:
                return { value: key, label: key }
        }
    }

    if (isLoading) {
        return (
            <div className={styles["loading-wrapper"]}>
                <Loader />
            </div>
        )
    }

    return (
        <div
            style={{
                height: rowVirtualizer.getTotalSize() + size.headerHeight,
                width: columnVirtualizer.getTotalSize() + size.cellWidth,
            }}
        >
            <div className={styles["sticky-header"]}>
                {columnVirtualizer?.getVirtualItems()?.map((column) => {
                    const product = products?.[column.index]
                    return (
                        <div
                            key={column.key}
                            className={`${styles.cell} ${styles["header-cell"]}`}
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
                                                location.pathname +
                                                location.search,
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

            <div
                className={styles["body-row"]}
                style={{
                    height: rowVirtualizer.getTotalSize(),
                }}
            >
                <div
                    className={`bold ${styles.cell} ${styles["cell-remove-all"]}`}
                    onClick={removeAllCompareItems}
                >
                    <span className={styles["text-remove-all"]}>
                        Remove all
                    </span>
                </div>
                {rowVirtualizer.getVirtualItems().map((row) => (
                    <div
                        key={row.key}
                        className={`bold ${styles.cell} ${styles["body-label"]}`}
                        style={{
                            top: row.start + size.headerHeight,
                        }}
                    >
                        {getBasicInfoValue(String(row.key), products?.[0]).label}
                    </div>
                ))}
            </div>

            {rowVirtualizer?.getVirtualItems()?.map((row) => (
                <div key={row.key}>
                    {columnVirtualizer?.getVirtualItems()?.map((column) => {
                        const currentProduct = products?.[column.index]
                        const currentIngredient =
                            currentProduct?.ingredient?.filter(
                                (ingredient) => ingredient.name === row.key
                            )?.[0]

                        const displayValue = BASIC_INFO.includes(
                            String(row.key)
                        )
                            ? getBasicInfoValue(String(row.key), currentProduct).value
                            : ""
                        return (
                            <div
                                key={`${row.key}-${column.key}`}
                                className={`${styles.cell} ${styles["body-cell"]}`}
                                style={{
                                    top: row.start + size.headerHeight,
                                    left: column.start + size.cellWidth,
                                }}
                            >
                                {BASIC_INFO.includes(String(row.key)) ? (
                                    displayValue
                                ) : (
                                    <FontAwesomeIcon
                                        icon={
                                            currentIngredient
                                                ? faCheck
                                                : faXmark
                                        }
                                        style={{
                                            fontSize: 16,
                                            color: currentIngredient
                                                ? "var(--color-green-500)"
                                                : "var(--color-red-500)",
                                        }}
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}

export default VirtualArea
