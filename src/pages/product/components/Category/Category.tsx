import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui"
import {
    QUERY_KEY_CATEGORIES,
    getListCategory,
} from "@/apis/category/getListCategory"
import styles from "./Category.module.css"

type Props = {
    activeCategoryId: number
    onChangeCategory: (id: number) => void
}

const Category = ({ activeCategoryId, onChangeCategory }: Props) => {
    const { data: categories } = useQuery({
        queryKey: [QUERY_KEY_CATEGORIES],
        queryFn: getListCategory,
    })

    return (
        <div className={`${styles["category-container"]} scrollbar-hidden`}>
            <Button
                onClick={() => onChangeCategory(0)}
                variant={!activeCategoryId ? "primary" : "secondary"}
                className={styles["category-button"]}
            >
                All Products
            </Button>
            {categories?.map((category) => (
                <Button
                    key={category.id}
                    onClick={() => onChangeCategory(category.id)}
                    variant={
                        activeCategoryId === category.id
                            ? "primary"
                            : "secondary"
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
