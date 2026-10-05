import { useMemo, useRef } from "react"
import styles from "./Compare.module.css"
import { useVirtualizer } from "@tanstack/react-virtual"
import {
    getListProduct,
    QUERY_KEY_PRODUCTS,
} from "../../apis/product/getListProduct"
import { useQuery } from "@tanstack/react-query"
import { FALLBACK_IMAGE } from "../../constants"
import Button from "../../components/ui/Button/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartPlus, faTrash } from "@fortawesome/free-solid-svg-icons"

const HEADER_HEIGHT = 220
const CELL_HEIGHT = 55
const CELL_WIDTH = 300
const OVERSCAN = 2

const Compare = () => {
    const parentRef = useRef<HTMLDivElement>(null)

    const { data: products } = useQuery({
        queryKey: [QUERY_KEY_PRODUCTS],
        queryFn: () =>
            getListProduct({
                extra_fields: ["ingredient"],
            }),
    })

    const ingredients: string[] = useMemo(() => {
        const uniqueIngredients = new Set<string>()
        products?.data?.forEach((item) => {
            item.ingredient?.forEach((ingredient) => {
                uniqueIngredients.add(ingredient.name)
            })
        })
        return Array.from(uniqueIngredients)
    }, [products?.data])

    const basicInfo = ["price", "category.name"]

    const rowLabels = [...basicInfo, ...ingredients]

    const rowVirtualizer = useVirtualizer({
        count: rowLabels?.length || 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => CELL_HEIGHT,
        overscan: OVERSCAN,
        getItemKey: (index) => rowLabels?.[index] || "",
    })

    const columnVirtualizer = useVirtualizer({
        horizontal: true,
        count: products?.data.length || 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => CELL_WIDTH,
        overscan: OVERSCAN,
        getItemKey: (index) => products?.data?.[index]?.id || 0,
    })
    console.log(
        "rowVirtualizer?.getVirtualItems()",
        rowVirtualizer?.getVirtualItems()
    )
    console.log(
        "columnVirtualizer?.getVirtualItems()",
        columnVirtualizer?.getVirtualItems()
    )

    return (
        <div className={styles["view-area"]} ref={parentRef}>
            <div
                style={{
                    height: rowVirtualizer.getTotalSize() + HEADER_HEIGHT,
                    width: columnVirtualizer.getTotalSize() + CELL_WIDTH,
                }}
            >
                <div style={{ position: "sticky", top: 0, left: 0, zIndex: 1 }}>
                    {columnVirtualizer?.getVirtualItems()?.map((column) => (
                        <div
                            key={column.key}
                            className={`${styles.product} ${styles.cell}`}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: column.start + CELL_WIDTH,
                                width: CELL_WIDTH,
                                height: HEADER_HEIGHT,
                            }}
                        >
                            <div className={styles["product-info"]}>
                                <img
                                    src={
                                        products?.data?.[column.index]
                                            ?.img_url || FALLBACK_IMAGE
                                    }
                                    alt="product-img"
                                    className={styles["product-img"]}
                                />

                                <span className="bold">
                                    {products?.data?.[column.index]?.name}
                                </span>
                            </div>
                            <div className={styles["product-actions"]}>
                                <Button
                                    variant="border-black"
                                    icon={<FontAwesomeIcon icon={faTrash} />}
                                    className={styles["button-action"]}
                                >
                                    Remove
                                </Button>
                                <Button
                                    variant="secondary"
                                    icon={<FontAwesomeIcon icon={faCartPlus} />}
                                    className={styles["button-action"]}
                                >
                                    Add
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        position: "sticky",
                        left: 0,
                        width: CELL_WIDTH,
                        height: rowVirtualizer.getTotalSize(),
                        zIndex: 1,
                    }}
                >
                    <div
                        className={`bold ${styles.cell}`}
                        style={{
                            position: "sticky",
                            top: 0,
                            left: 0,
                            zIndex: 2,
                            width: CELL_WIDTH,
                            height: HEADER_HEIGHT,
                            textDecoration: "underline",
                            alignContent: "end",
                        }}
                    >
                        Remove all
                    </div>
                    {rowVirtualizer.getVirtualItems().map((row) => (
                        <div
                            key={row.key}
                            className={`bold ${styles.cell}`}
                            style={{
                                position: "absolute",
                                top: row.start + HEADER_HEIGHT,
                                left: 0,
                                width: CELL_WIDTH,
                                height: CELL_HEIGHT,
                            }}
                        >
                            {row.key}
                        </div>
                    ))}
                </div>

                {rowVirtualizer?.getVirtualItems()?.map((row) => (
                    <div key={row.key}>
                        {columnVirtualizer?.getVirtualItems()?.map((column) => {
                            const currentProduct =
                                products?.data?.[column.index]
                            const currentValue =
                                currentProduct?.[String(row.key)]
                            const currentIngredient =
                                currentProduct?.ingredient?.filter(
                                    (ingredient) => ingredient.name === row.key
                                )?.[0]
                                    ? "Yes"
                                    : "No"
                            return (
                                <div
                                    key={`${row.key}-${column.key}`}
                                    className={`${styles.cell} ${styles["body-cell"]}`}
                                    style={{
                                        position: "absolute",
                                        top: row.start + HEADER_HEIGHT,
                                        left: column.start + CELL_WIDTH,
                                        width: CELL_WIDTH,
                                        height: CELL_HEIGHT,
                                    }}
                                >
                                    {basicInfo.includes(String(row.key))
                                        ? currentValue
                                        : currentIngredient}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Compare
