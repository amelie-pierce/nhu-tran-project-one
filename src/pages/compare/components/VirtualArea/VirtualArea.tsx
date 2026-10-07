import { useMemo } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import type { Product } from "@/types/product"
import { Loader } from "@/components/ui"
import { useScreenWidth } from "@/hooks/useScreenWidth"
import { OVERSCAN, BASIC_INFO } from "../../constants"
import {
    VirtualColumn,
    VirtualContent,
    VirtualLabel,
} from "@/pages/compare/components"

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

    if (isLoading) {
        return <Loader />
    }

    return (
        <div
            style={{
                height: rowVirtualizer.getTotalSize() + size.headerHeight,
                width: columnVirtualizer.getTotalSize() + size.cellWidth,
            }}
        >
            <VirtualColumn
                columnVirtualizer={columnVirtualizer}
                products={products}
                size={size}
                screenWidth={screenWidth}
            />

            <VirtualLabel
                rowVirtualizer={rowVirtualizer}
                products={products}
                size={size}
            />

            <VirtualContent
                rowVirtualizer={rowVirtualizer}
                columnVirtualizer={columnVirtualizer}
                products={products}
                size={size}
            />
        </div>
    )
}

export default VirtualArea
