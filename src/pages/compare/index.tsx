import { useMemo, useRef } from "react"
import styles from "./Compare.module.css"
import {
    getListProduct,
    QUERY_KEY_PRODUCTS,
} from "../../apis/product/getListProduct"
import { useQuery } from "@tanstack/react-query"
import { useUserData } from "../../contexts/UserDataContext"
import Empty from "../../components/ui/Empty/Emtpy"
import Error from "../../components/ui/error/Error"
import Breadcrumb from "../../components/ui/Breadcrumb/Breadcrumb"
import VirtualArea from "./components/VirtualArea/VirtualArea"

const Compare = () => {
    const parentRef = useRef<HTMLDivElement>(null)
    const { compareList } = useUserData()

    const {
        data: products,
        isLoading,
        isError,
    } = useQuery({
        queryKey: [QUERY_KEY_PRODUCTS, compareList?.join(",")],
        queryFn: () =>
            getListProduct({
                extra_fields: ["ingredient"],
                product_ids: compareList,
            }),
        enabled: compareList?.length > 0,
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

    if (isError) {
        return <Error />
    }

    if (!compareList?.length) {
        return <Empty label="comparision" />
    }

    return (
        <>
            <Breadcrumb title="COMPARE PRODUCTS" currentPage="Compare" />
            <div className={`${styles["view-area-wrapper"]} page-padding`}>
                <div className={styles["view-area"]} ref={parentRef}>
                    <VirtualArea
                        parentRef={parentRef}
                        products={products?.data}
                        isLoading={isLoading}
                        ingredients={ingredients}
                    />
                </div>
            </div>
        </>
    )
}

export default Compare
