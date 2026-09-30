import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { getUser, QUERY_KEY_USER } from "../apis/auth/getUser"
import { useAddToCart } from "./useAddToCart"
import type { ActionState } from "../types/action"

export const useProductAction = () => {
    const navigate = useNavigate()
    const { handleAddToCart } = useAddToCart()

    const { data: user } = useQuery({
        queryKey: [QUERY_KEY_USER],
        queryFn: getUser,
    })

    const handleProductAction = (action: ActionState) => {
        if (!user) {
            navigate("/login", { state: action })
            return
        }

        if (action.type === "add") {
            handleAddToCart(action.productId, action.quantity)
            return
        }

        if (action.type === "buy") {
            navigate(action.redirectTo)
        }
    }

    return {
        handleProductAction,
    }
}
