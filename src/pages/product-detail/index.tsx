import ProductInfo from "./components/ProductInfo/ProductInfo"
import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import {
    getProductDetail,
    QUERY_KEY_PRODUCT_DETAIL,
} from "../../apis/product/getProductDetail"
import Breadcrumb from "../../components/ui/Breadcrumb/Breadcrumb"

const ProductDetail = () => {
    const { id } = useParams()
    console.log(id, typeof id)

    const { data, error, isLoading } = useQuery({
        queryFn: () => getProductDetail({ id: Number(id) }),
        queryKey: [QUERY_KEY_PRODUCT_DETAIL, id],
        enabled: !!id,
    })

    if (!data) {
        return <div>Product not found</div>
    }

    return (
        <>
            <Breadcrumb
                title="PRODUCT DETAILS"
                currentPage={data?.category?.name || ""}
            />

            <div className="page-padding">
                <ProductInfo product={data} />
            </div>
        </>
    )
}

export default ProductDetail
