import { useUser } from "@/contexts/UserContext"
import { Navigate, useLocation } from "react-router"

type Props = {
    children: React.ReactNode
}

const GuestRoute = ({ children }: Props) => {
    const location = useLocation()
    const state = location.state
    const { isLoggedIn } = useUser()

    if (isLoggedIn) {
        return <Navigate to={state?.redirectTo || "/"} replace state={state} />
    }

    return <>{children}</>
}

export default GuestRoute
