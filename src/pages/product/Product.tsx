import styles from "./Product.module.css"
import { ProductList } from "./components"

const Product = () => {
    return (
        <div className={`${styles["wrapper"]} page-padding page-layout`}>
            <img
                src="https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/assets/banner.jpg"
                alt="banner"
                className={styles["banner-img"]}
                loading="lazy"
            />
            <ProductList />
        </div>
    )
}

export default Product
