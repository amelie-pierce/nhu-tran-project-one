import { useNavigate } from "react-router"
import type { ActionState } from "@/types/action"
import { useUserData } from "@/contexts/UserDataContext"
import { useUser } from "@/contexts/UserContext"

export const useProductAction = () => {
    const navigate = useNavigate()
    const { addToCartList } = useUserData()
    const { isLoggedIn } = useUser()

    const handleProductAction = (action: ActionState) => {
        if (!isLoggedIn) {
            navigate("/login", { state: action })
            return
        }

        if (action.type === "add") {
            const item = action.items?.[0]
            addToCartList(item.id || 0, item.quantity)
            return
        }

        if (action.type === "buy") {
            navigate(action.redirectTo, { state: action })
        }
    }

    return {
        handleProductAction,
    }
}
