import { useQuery } from "@tanstack/react-query"
import styles from "./ProductList.module.css"
import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router"
import Pagination from "../../../../components/ui/Pagination/Pagination"
import {
    QUERY_KEY_PRODUCTS,
    getListProduct,
} from "../../../../apis/product/getListProduct"
import Error from "../../../../components/ui/error/Error"
import Loader from "../../../../components/ui/Loader/Loader"
import { useScreenWidth } from "../../../../hooks/useScreenWidth"
import ProductItem from "../ProductItem/ProductItem"
import Category from "../Category/Category"

const ProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [currentPage, setCurrentPage] = useState(1)
    const [activeCategoryId, setActiveCategoryId] = useState<number>(
        Number(searchParams.get("category_id"))
    )
    const catalogRef = useRef<HTMLDivElement>(null)

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
    })

    useEffect(() => {
        if (!isFetching) {
            catalogRef.current?.scrollIntoView({
                behavior: "smooth",
            })
        }
    }, [currentPage, isFetching])

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
        setCurrentPage(page)

        const params = new URLSearchParams(searchParams)
        params.set("page", String(page))
        setSearchParams(params)
    }

    if (isLoading) {
        return (
            <div className={styles["loader-container"]}>
                <Loader />
            </div>
        )
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
    )
}

export default ProductList
