import { useMemo, useRef } from "react"
import { useUserData } from "@/contexts/UserDataContext"
import { Breadcrumb, Empty } from "@/components"
import VirtualArea from "./components/VirtualArea/VirtualArea"
import styles from "./Compare.module.css"
import { useUser } from "@/contexts/UserContext"
import type { Product } from "@/types/product"

const Compare = () => {
    const parentRef = useRef<HTMLDivElement>(null)
    const { compareList, isCompareFetching } = useUserData()
    const { isLoggedIn } = useUser()

    const data = useMemo(() => {
        const uniqueIngredients = new Set<string>()
        const products: Product[] = []
        compareList?.forEach((item) => {
            products.push(item?.product)
            item?.product?.ingredient?.forEach((ingredient) => {
                uniqueIngredients.add(ingredient.name)
            })
        })
        const ingredients = Array.from(uniqueIngredients)?.sort((a, b) =>
            a.localeCompare(b)
        )
        return { products, ingredients }
    }, [compareList])

    const loadingAPI = isLoggedIn && isCompareFetching

    if (!compareList?.length && !loadingAPI) {
        return <Empty label="Your comparison" />
    }

    return (
        <>
            <Breadcrumb title="COMPARE PRODUCTS" currentPage="Compare" />
            <div className={`${styles["view-area-wrapper"]} page-padding`}>
                <div className={styles["view-area"]} ref={parentRef}>
                    <VirtualArea
                        parentRef={parentRef}
                        products={data.products}
                        isFetching={loadingAPI}
                        ingredients={data.ingredients}
                    />
                </div>
            </div>
        </>
    )
}

export default Compare
