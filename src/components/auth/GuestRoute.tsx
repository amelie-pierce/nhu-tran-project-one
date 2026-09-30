import { useQuery } from "@tanstack/react-query"
import { Navigate } from "react-router"
import { getUser } from "../../apis/auth/getUser"

type Props = {
    children: React.ReactNode
}

const GuestRoute = ({ children }: Props) => {
    const { data: user, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    })

    if (isLoading) {
        return null
    }

    if (user) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

export default GuestRoute
