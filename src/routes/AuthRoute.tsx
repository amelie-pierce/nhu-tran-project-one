import { Navigate, useLocation } from "react-router"
import { useUser } from "@/contexts/UserContext"

type Props = {
    children: React.ReactNode
}

const AuthRoute = ({ children }: Props) => {
    const location = useLocation()
    const state = location.state
    const { isLoggedIn } = useUser()

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={state} />
    }

    return <>{children}</>
}

export default AuthRoute
