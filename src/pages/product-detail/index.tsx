import ProductActions from "./components/ProductActions/ProductActions"
import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import {
    getProductDetail,
    QUERY_KEY_PRODUCT_DETAIL,
} from "../../apis/product/getProductDetail"

const ProductDetail = () => {
    const { id } = useParams()
    console.log(id, typeof id)

    const { data, error, isLoading } = useQuery({
        queryFn: () => getProductDetail({ id: Number(id) }),
        queryKey: [QUERY_KEY_PRODUCT_DETAIL, id],
        enabled: !!id,
    })

    if (!data && !isLoading) {
        return <div>Product not found</div>
    }

    return (
        <>
            <ProductActions product={data} />
        </>
    )
}

export default ProductDetail
