import styles from "./Product.module.css"
import { ProductList } from "./components"
import { transformImage } from "@/utils/transformImage"

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
                    ${transformImage(img, 1200)} 1200w
                `}
                sizes="(max-width: 480px) 330px, (max-width: 1024px) 640px, 1200px"
                alt="banner"
                className={styles["banner-img"]}
                fetchPriority="high"
            />
            <ProductList />
        </div>
    )
}

export default Product
