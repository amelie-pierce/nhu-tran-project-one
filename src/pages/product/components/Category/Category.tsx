import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Button from "../../../../components/ui/Button/Button"
import {
    QUERY_KEY_CATEGORIES,
    getListCategory,
} from "../../../../apis/category/getListCategory"
import styles from "./Category.module.css"

const Category = () => {
    const [activeCategory, setActiveCategory] = useState<number>(0)

    const { data: categories } = useQuery({
        queryKey: [QUERY_KEY_CATEGORIES],
        queryFn: getListCategory,
    })

    return (
        <div className={styles["category-container"]}>
            <Button
                onClick={() => setActiveCategory(0)}
                variant={!activeCategory ? "primary" : "secondary"}
                className={styles["category-button"]}
            >
                All Products
            </Button>
            {categories?.map((category) => (
                <Button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    variant={
                        activeCategory === category.id ? "primary" : "secondary"
                    }
                    className={styles["category-button"]}
                >
                    {category.name}
                </Button>
            ))}
        </div>
    )
}

export default Category
