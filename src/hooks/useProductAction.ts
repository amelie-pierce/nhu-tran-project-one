import { useState } from "react"
import { useNavigate } from "react-router"
import type { ActionState } from "@/types/action"
import { useUserData } from "@/contexts/UserDataContext"
import { useUser } from "@/contexts/UserContext"

export const useProductAction = () => {
    const navigate = useNavigate()
    const { addToCartList } = useUserData()
    const { isLoggedIn } = useUser()
    const [isPending, setIsPending] = useState(false)

    const handleProductAction = async (action: ActionState) => {
        if (!isLoggedIn) {
            navigate("/login", { state: action })
            return
        }

        try {
            setIsPending(true)

            if (action?.type === "add") {
                const item = action?.items?.[0]
                await addToCartList(item, item?.quantity)
            }

            if (action?.type === "buy") {
                navigate(action?.redirectTo, { state: action })
            }
        } finally {
            setIsPending(false)
        }
    }

    return {
        handleProductAction,
        isPending,
    }
}
