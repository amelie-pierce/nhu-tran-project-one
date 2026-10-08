import styles from "./Product.module.css"
import { ProductList } from "./components"

const Product = () => {
    const img =
        "https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/assets/banner.jpg"
    return (
        <div className={`${styles["wrapper"]} page-padding page-layout`}>
            <img
                src={img}
                srcSet={`${img} 700w,${img} 700w, ${img} 7000w`}
                sizes="(max-width: 400px) 700w, 7000w"
                alt="banner"
                className={styles["banner-img"]}
                fetchPriority="high"
            />
            <ProductList />
        </div>
    )
}

export default Product
