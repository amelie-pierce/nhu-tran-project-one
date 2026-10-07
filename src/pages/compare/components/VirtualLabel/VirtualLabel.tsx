import type { ReactVirtualizer } from "@tanstack/react-virtual"
import type { Product } from "@/types/product"
import { useUserData } from "@/contexts/UserDataContext"
import { getBasicInfoValue } from "@/pages/compare/utils"
import styles from "./VirtualLabel.module.css"
import globalStyles from "../VirtualArea/VirtualArea.module.css"

type Props = {
    rowVirtualizer: ReactVirtualizer<HTMLDivElement, Element>
    size: {
        headerHeight: number
        cellHeight: number
        cellWidth: number
    }
    products?: Product[]
}

const VirtualLabel = ({ rowVirtualizer, size, products }: Props) => {
    const { removeAllCompareItems } = useUserData()

    return (
        <div
            className={styles["body-row"]}
            style={{
                height: rowVirtualizer.getTotalSize(),
            }}
        >
            <div
                className={`bold ${globalStyles.cell} ${styles["cell-remove-all"]}`}
                onClick={removeAllCompareItems}
            >
                <span className={styles["text-remove-all"]}>Remove all</span>
            </div>
            {rowVirtualizer.getVirtualItems().map((row) => (
                <div
                    key={row.key}
                    className={`bold ${globalStyles.cell} ${styles["body-label"]}`}
                    style={{
                        top: row.start + size.headerHeight,
                    }}
                >
                    {getBasicInfoValue(String(row.key), products?.[0]).label}
                </div>
            ))}
        </div>
    )
}

export default VirtualLabel
