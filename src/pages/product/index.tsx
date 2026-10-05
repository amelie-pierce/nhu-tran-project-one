import { useQuery } from "@tanstack/react-query"
import styles from "./Product.module.css"
import { useEffect, useMemo, useState } from "react"
import { useScreenWidth } from "../../hooks/useScreenWidth"
import Pagination from "../../components/ui/Pagination/Pagination"
import {
    QUERY_KEY_PRODUCTS,
    getListProduct,
} from "../../apis/product/getListProduct"
import ProductItem from "./components/ProductItem/ProductItem"
import Category from "./components/Category/Category"
import { useSearchParams } from "react-router"
import Error from "../../components/ui/error/Error"
import Loader from "../../components/ui/Loader/Loader"

const Product = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [currentPage, setCurrentPage] = useState(1)
    const [activeCategoryId, setActiveCategoryId] = useState<number>(
        Number(searchParams.get("category_id"))
    )

    useEffect(() => {
        setActiveCategoryId(Number(searchParams.get("category_id")))
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
        isError,
        error,
    } = useQuery({
        queryKey: [QUERY_KEY_PRODUCTS, currentPage, limit, activeCategoryId],
        queryFn: () =>
            getListProduct({
                page: currentPage,
                limit: limit,
                category_id: activeCategoryId,
            }),
    })

    const handleChangeCategory = (id: number) => {
        setCurrentPage(1)
        setActiveCategoryId(id)

        if (id) {
            setSearchParams({ category_id: String(id) })
        } else {
            setSearchParams({})
        }
    }

    if (isLoading) {
        return <Loader />
    }

    if (isError) {
        return <Error />
    }

    return (
        <div className={`${styles["wrapper"]} page-padding page-layout`}>
            <img
                src="https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/assets/banner.jpg"
                alt="banner"
                className={styles["banner-img"]}
            />
            <div className={styles["product-catalog"]}>
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
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default Product
