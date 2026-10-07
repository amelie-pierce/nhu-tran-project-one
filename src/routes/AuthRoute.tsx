import { useQuery } from "@tanstack/react-query"
import { Navigate } from "react-router"
import { getUser, QUERY_KEY_USER } from "@/apis/auth/getUser"
import { Loader } from "@/components/ui"

type Props = {
    children: React.ReactNode
}

const AuthRoute = ({ children }: Props) => {
    const { data: user, isLoading } = useQuery({
        queryKey: [QUERY_KEY_USER],
        queryFn: getUser,
    })

    if (isLoading) {
        return <Loader />
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

export default AuthRoute
