import styles from "./Product.module.css"
import { ProductList } from "./components"
import { transformImage } from "@/utils/transformImage"
import { getImgSizeWidth } from "@/utils/getImgSizeWidth"

const Product = () => {
    const img =
        "https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/assets/banner.png"

    return (
        <div className={`${styles["wrapper"]} page-padding page-layout`}>
            <img
                src={transformImage(img, 1200)}
                srcSet={`
                    ${transformImage(img, 330)} 330w,
                    ${transformImage(img, 640)} 640w,
                    ${transformImage(img, 1200)} 1200w,
                    ${transformImage(img, 1600)} 1600w,
                `}
                sizes={getImgSizeWidth(330, 640, 1200, 1600)}
                alt="banner"
                className={styles["banner-img"]}
                fetchPriority="high"
            />
            <ProductList />
        </div>
    )
}

export default Product
