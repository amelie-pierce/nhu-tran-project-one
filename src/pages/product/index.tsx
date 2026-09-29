import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../apis/product/getProduct";

const Product = () => {
    const {
        data: products,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            {products?.map((product) => (
                <div key={product.id}>
                    <div>{product.name}</div>
                    <div>{product.price}</div>
                </div>
            ))}
        </div>
    );
}

export default Product;