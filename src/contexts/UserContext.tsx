import { createContext, useState, useEffect, useContext } from "react"
import { supabase } from "@/lib/supabase"

type UserContextType = {
    isLoggedIn: boolean
}

const UserContext = createContext<UserContextType | null>(null)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "INITIAL_SESSION") {
                setIsLoggedIn(!!session?.user?.id)
            } else if (event === "SIGNED_IN") {
                setIsLoggedIn(!!session?.user?.id)
            } else if (event === "SIGNED_OUT") {
                setIsLoggedIn(false)
            }
        })

        return () => {
            data.subscription.unsubscribe()
        }
    }, [])

    return (
        <UserContext.Provider value={{ isLoggedIn }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)

    if (!context) {
        throw new Error("useUser must be used inside UserProvider")
    }

    return context
}
