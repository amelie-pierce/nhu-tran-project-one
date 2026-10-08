import { useMemo, useRef } from "react"
import {
    getListProduct,
    QUERY_KEY_PRODUCTS,
} from "@/apis/product/getListProduct"
import { useQuery } from "@tanstack/react-query"
import { useUserData } from "@/contexts/UserDataContext"
import { Breadcrumb, Empty, Error } from "@/components"
import VirtualArea from "./components/VirtualArea/VirtualArea"
import styles from "./Compare.module.css"

const Compare = () => {
    const parentRef = useRef<HTMLDivElement>(null)
    const { compareList } = useUserData()

    const {
        data: products,
        isLoading,
        isFetching,
        isError,
    } = useQuery({
        queryKey: [QUERY_KEY_PRODUCTS],
        queryFn: () =>
            getListProduct({
                extra_fields: ["ingredient"],
                product_ids: compareList,
            }),
        enabled: compareList?.length > 0,
    })

    const compareProducts = useMemo(
        () =>
            products?.data?.filter((product) =>
                compareList.includes(product.id)
            ),
        [products?.data, compareList]
    )

    const ingredients: string[] = useMemo(() => {
        const uniqueIngredients = new Set<string>()
        compareProducts?.forEach((item) => {
            item.ingredient?.forEach((ingredient) => {
                uniqueIngredients.add(ingredient.name)
            })
        })
        return Array.from(uniqueIngredients)
    }, [compareProducts])

    if (isError) {
        return <Error />
    }

    if (!compareList?.length && !isFetching) {
        return <Empty label="comparison" />
    }

    return (
        <>
            <Breadcrumb title="COMPARE PRODUCTS" currentPage="Compare" />
            <div className={`${styles["view-area-wrapper"]} page-padding`}>
                <div className={styles["view-area"]} ref={parentRef}>
                    <VirtualArea
                        parentRef={parentRef}
                        products={compareProducts}
                        isFetching={isFetching}
                        ingredients={ingredients}
                    />
                </div>
            </div>
        </>
    )
}

export default Compare
