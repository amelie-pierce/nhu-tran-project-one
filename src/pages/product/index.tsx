import { useQuery } from "@tanstack/react-query"
import styles from "./Product.module.css"
import { useMemo, useState } from "react"
import { useScreenWidth } from "../../hooks/useScreenWidth"
import Pagination from "../../components/ui/Pagination/Pagination"
import {
    QUERY_KEY_PRODUCTS,
    getListProduct,
} from "../../apis/product/getListProduct"
import ProductItem from "./components/ProductItem/ProductItem"

const Product = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const screenWidth = useScreenWidth()

    const limit = useMemo(() => {
        if (screenWidth >= 1440) return 8
        if (screenWidth >= 768) return 9
        return 4
    }, [screenWidth])

    const {
        data: products,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: [QUERY_KEY_PRODUCTS, currentPage, limit],
        queryFn: () =>
            getListProduct({
                page: currentPage,
                limit: limit,
            }),
    })

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error: {error.message}</div>
    }

    return (
        <div className={styles["product-container"]}>
            {products?.data?.map((product) => (
                <ProductItem product={product} />
            ))}
            <Pagination
                currentPage={currentPage}
                totalPage={products?.totalPage ?? 1}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default Product
