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
import {
    faCartPlus,
    faCheck,
    faTrash,
    faXmark,
} from "@fortawesome/free-solid-svg-icons"
import { useUserData } from "../../contexts/UserDataContext"
import Empty from "../../components/ui/Empty/Emtpy"
import { useProductAction } from "../../hooks/useProductAction"
import { useScreenWidth } from "../../hooks/useScreenWidth"

const OVERSCAN = 2

const Compare = () => {
    const parentRef = useRef<HTMLDivElement>(null)
    const { compareList, toggleCompareItem, removeAllCompareItems } =
        useUserData()
    const { handleProductAction } = useProductAction()
    const screenWidth = useScreenWidth()

    const size = useMemo(() => {
        if (screenWidth > 1440) {
            return {
                headerHeight: 220,
                cellHeight: 55,
                cellWidth: 300,
            }
        }
        if (screenWidth >= 768) {
            return {
                headerHeight: 200,
                cellHeight: 45,
                cellWidth: 250,
            }
        }
        return {
            headerHeight: 120,
            cellHeight: 35,
            cellWidth: 120,
        }
    }, [screenWidth])

    const { data: products } = useQuery({
        queryKey: [QUERY_KEY_PRODUCTS, compareList?.join(",")],
        queryFn: () =>
            getListProduct({
                extra_fields: ["ingredient"],
                product_ids: compareList,
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
        estimateSize: () => size.cellHeight,
        overscan: OVERSCAN,
        getItemKey: (index) => rowLabels?.[index] || "",
    })

    const columnVirtualizer = useVirtualizer({
        horizontal: true,
        count: products?.data.length || 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => size.cellWidth,
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

    if (!compareList?.length) {
        return <Empty label="comparision" />
    }

    return (
        <div className={styles["view-area"]} ref={parentRef}>
            <div
                style={{
                    height: rowVirtualizer.getTotalSize() + size.headerHeight,
                    width: columnVirtualizer.getTotalSize() + size.cellWidth,
                }}
            >
                <div className={styles["sticky-header"]}>
                    {columnVirtualizer?.getVirtualItems()?.map((column) => {
                        const product = products?.data?.[column.index]
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

                                    <div className="bold text-truncate">
                                        {product?.name}
                                    </div>
                                </div>
                                <div className={styles["product-actions"]}>
                                    <Button
                                        variant="border-black"
                                        icon={
                                            <FontAwesomeIcon icon={faTrash} />
                                        }
                                        className={styles["button-action"]}
                                        onClick={() => {
                                            toggleCompareItem(
                                                Number(column.key)
                                            )
                                        }}
                                    >
                                        {screenWidth > 768 ? "Remove" : null}
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        icon={
                                            <FontAwesomeIcon
                                                icon={faCartPlus}
                                            />
                                        }
                                        className={styles["button-action"]}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleProductAction({
                                                type: "add",
                                                items: [
                                                    { ...product, quantity: 1 },
                                                ],
                                                redirectTo:
                                                    location.pathname +
                                                    location.search,
                                            })
                                        }}
                                    >
                                        {screenWidth > 768 ? "Add" : null}
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
                            return (
                                <div
                                    key={`${row.key}-${column.key}`}
                                    className={`${styles.cell} ${styles["body-cell"]}`}
                                    style={{
                                        top: row.start + size.headerHeight,
                                        left: column.start + size.cellWidth,
                                    }}
                                >
                                    {basicInfo.includes(String(row.key)) ? (
                                        currentValue
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
        </div>
    )
}

export default Compare
