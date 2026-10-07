import type { ReactVirtualizer } from "@tanstack/react-virtual"
import type { Product } from "@/types/product"
import { getBasicInfoValue } from "@/pages/compare/utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"
import { BASIC_INFO } from "../../constants"
import styles from "./VirtualContent.module.css"
import globalStyles from "../VirtualArea/VirtualArea.module.css"

type Props = {
    rowVirtualizer: ReactVirtualizer<HTMLDivElement, Element>
    columnVirtualizer: ReactVirtualizer<HTMLDivElement, Element>
    products?: Product[]
    size: {
        headerHeight: number
        cellHeight: number
        cellWidth: number
    }
}

const VirtualContent = ({
    rowVirtualizer,
    columnVirtualizer,
    products,
    size,
}: Props) => {
    return (
        <>
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
                            ? getBasicInfoValue(String(row.key), currentProduct)
                                  .value
                            : ""
                        return (
                            <div
                                key={`${row.key}-${column.key}`}
                                className={`${globalStyles.cell} ${styles["body-cell"]}`}
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
        </>
    )
}

export default VirtualContent
