import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { getUser, QUERY_KEY_USER } from "@/apis/auth/getUser"
import type { ActionState } from "@/types/action"
import { useUserData } from "@/contexts/UserDataContext"

export const useProductAction = () => {
    const navigate = useNavigate()
    const { addToCartList } = useUserData()

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
            const item = action.items?.[0]
            addToCartList(item.id || 0, item.quantity)
            return
        }

        if (action.type === "buy") {
            navigate(action.redirectTo, { state: action.items })
        }
    }

    return {
        handleProductAction,
    }
}
