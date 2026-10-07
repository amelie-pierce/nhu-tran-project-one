import { useQuery } from "@tanstack/react-query"
import { Navigate, useLocation } from "react-router"
import { getUser, QUERY_KEY_USER } from "@/apis/auth/getUser"
import { Loader } from "@/components/ui"

type Props = {
    children: React.ReactNode
}

const GuestRoute = ({ children }: Props) => {
    const location = useLocation()
    const action = location.state

    const { data: user, isLoading } = useQuery({
        queryKey: [QUERY_KEY_USER],
        queryFn: getUser,
    })

    if (isLoading) {
        return <Loader />
    }

    if (user) {
        return <Navigate to={action?.redirectTo || "/"} replace />
    }

    return <>{children}</>
}

export default GuestRoute
