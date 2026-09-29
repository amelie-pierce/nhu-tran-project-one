import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getProducts } from "../../apis/product/getProduct";
import Pagination from "../../components/ui/Pagination";

const Product = () => {
    const [currentPage, setCurrentPage] = useState(1);

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
            <Pagination
                currentPage={currentPage}
                totalPage={100}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}

export default Product;