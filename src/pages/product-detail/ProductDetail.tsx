import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import {
    getProductDetail,
    QUERY_KEY_PRODUCT_DETAIL,
} from "@/apis/product/getProductDetail"
import { Breadcrumb, Error } from "@/components"
import { Loader } from "@/components/ui"
import { ProductInfo } from "@/pages/product-detail/components"

const ProductDetail = () => {
    const { id } = useParams()

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getProductDetail({ id: Number(id) }),
        queryKey: [QUERY_KEY_PRODUCT_DETAIL, id],
        staleTime: 1000 * 60 * 5,
        enabled: !!id,
    })

    if (isLoading) {
        return <Loader />
    }

    if (isError) {
        return <Error />
    }

    if (!data) {
        return <div>Product not found</div>
    }

    return (
        <>
            <Breadcrumb
                title="PRODUCT DETAILS"
                currentPage={data?.category?.name || ""}
            />

            <div className="page-padding" style={{ width: "100%" }}>
                <ProductInfo product={data} />
            </div>
        </>
    )
}

export default ProductDetail
