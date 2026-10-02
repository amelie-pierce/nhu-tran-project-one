import { useMemo, useRef } from "react"
import styles from "./Compare.module.css"
import { useVirtualizer } from "@tanstack/react-virtual"
import {
    getListProduct,
    QUERY_KEY_PRODUCTS,
} from "../../apis/product/getListProduct"
import { useQuery } from "@tanstack/react-query"

const FIXED_HEIGHT = 50
const FIXED_WIDTH = 200
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

    const rowVirtualizer = useVirtualizer({
        count: products?.data?.length || 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => FIXED_HEIGHT,
        overscan: OVERSCAN,
        getItemKey: (index) => ingredients?.[index] || "",
    })

    const columnVirtualizer = useVirtualizer({
        count: products?.data.length || 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => FIXED_WIDTH,
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
                className={styles["actual-area"]}
                style={{
                    height: rowVirtualizer.getTotalSize() + FIXED_HEIGHT,
                    width: columnVirtualizer.getTotalSize() + FIXED_WIDTH,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                    }}
                >
                    Remove all
                </div>
                {columnVirtualizer?.getVirtualItems()?.map((item) => (
                    <div
                        key={item.key}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: item.start + FIXED_WIDTH,
                            width: FIXED_WIDTH,
                        }}
                    >
                        {products?.data?.[item.index]?.name}
                    </div>
                ))}
            </div>

            {rowVirtualizer?.getVirtualItems()?.map((row) => (
                <>
                    <div
                        key={row.key}
                        style={{
                            position: "absolute",
                            top: row.start + FIXED_HEIGHT,
                            left: 0,
                            height: FIXED_HEIGHT,
                        }}
                    >
                        {row.key}
                    </div>
                    {columnVirtualizer?.getVirtualItems()?.map((column) => {
                        const currentProduct = products?.data?.[column.index]
                        const currentIngredient =
                            currentProduct?.ingredient?.filter(
                                (ingredient) => ingredient.name === row.key
                            )?.[0]
                        return (
                            <div
                                style={{
                                    position: "absolute",
                                    top: row.start + FIXED_HEIGHT,
                                    left: column.start + FIXED_WIDTH,
                                }}
                            >
                                {currentIngredient ? "Yes" : "No"}
                            </div>
                        )
                    })}
                </>
            ))}
        </div>
    )
}

export default Compare
