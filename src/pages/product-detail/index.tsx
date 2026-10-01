import ProductActions from "./components/ProductActions/ProductActions"
import { useParams } from "react-router"
import styles from "./ProductDetail.module.css"
import { useQuery } from "@tanstack/react-query"
import {
    getProductDetail,
    QUERY_KEY_PRODUCT_DETAIL,
} from "../../apis/product/getProductDetail"
import Breadcumb from "../../components/ui/Breadcrumb/Breadcrumb"

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
        <div>
            <Breadcumb
                title="PRODUCT DETAILS"
                currentPage={data?.category?.name || ""}
            />
            <div className={styles["product-detail-container"]}>
                <ProductActions product={data} />
            </div>
        </div>
    )
}

export default ProductDetail
