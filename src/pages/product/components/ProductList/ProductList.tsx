import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router"
import { Loader } from "@/components/ui"
import { Pagination, Error } from "@/components"
import {
    QUERY_KEY_PRODUCTS,
    getListProduct,
} from "@/apis/product/getListProduct"
import { useScreenWidth } from "@/hooks/useScreenWidth"
import { ProductItem, Category } from "@/pages/product/components"
import styles from "./ProductList.module.css"

const ProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [currentPage, setCurrentPage] = useState(1)
    const [activeCategoryId, setActiveCategoryId] = useState<number>(
        Number(searchParams.get("category_id"))
    )
    const catalogRef = useRef<HTMLDivElement>(null)
    const shouldScrollRef = useRef(false)

    useEffect(() => {
        setActiveCategoryId(Number(searchParams.get("category_id")))
        setCurrentPage(Number(searchParams.get("page")) || 1)
    }, [searchParams])

    const screenWidth = useScreenWidth()

    const limit = useMemo(() => {
        if (screenWidth <= 480) return 4
        if (screenWidth <= 1024) return 9
        return 8
    }, [screenWidth])

    const {
        data: products,
        isLoading,
        isFetching,
        isError,
    } = useQuery({
        queryKey: [QUERY_KEY_PRODUCTS, currentPage, limit, activeCategoryId],
        queryFn: () =>
            getListProduct({
                page: currentPage,
                limit: limit,
                category_id: activeCategoryId,
            }),
        staleTime: 1000 * 60 * 5,
    })

    useEffect(() => {
        if (shouldScrollRef.current && !isFetching) {
            catalogRef.current?.scrollIntoView({
                behavior: "smooth",
            })

            shouldScrollRef.current = false
        }
    }, [isFetching])

    const handleChangeCategory = (id: number) => {
        setCurrentPage(1)
        setActiveCategoryId(id)

        const params = new URLSearchParams(searchParams)
        params.delete("page")
        if (id) {
            params.set("category_id", String(id))
        } else {
            params.delete("category_id")
        }
        setSearchParams(params)
    }

    const handlePageChange = (page: number) => {
        shouldScrollRef.current = true
        setCurrentPage(page)

        const params = new URLSearchParams(searchParams)
        params.set("page", String(page))
        setSearchParams(params)
    }

    if (isError) {
        return <Error />
    }

    return (
        <>
            <div className={styles["product-catalog"]} ref={catalogRef}>
                <span className="title bold">Product Catalog</span>
                <Category
                    activeCategoryId={activeCategoryId}
                    onChangeCategory={handleChangeCategory}
                />
            </div>
            {isLoading ? (
                <div className={styles["loader-container"]}>
                    <Loader />
                </div>
            ) : (
                <>
                    <div className={styles["product-list"]}>
                        {products?.data?.map((product) => (
                            <ProductItem key={product.id} product={product} />
                        ))}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPage={products?.totalPage ?? 1}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </>
    )
}

export default ProductList
