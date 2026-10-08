import { createContext, useState, useEffect, useContext } from "react"
import { supabase } from "@/lib/supabase"

type UserContextType = {
    user_id: string | null
    isLoggedIn: boolean
}

const UserContext = createContext<UserContextType | null>(null)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserContextType>({
        user_id: null,
        isLoggedIn: false,
    })

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(event, session)

            if (event === "INITIAL_SESSION") {
                setUser({
                    user_id: session?.user?.id || null,
                    isLoggedIn: !!session?.user?.id,
                })
            } else if (event === "SIGNED_IN") {
                setUser({
                    user_id: session?.user?.id || null,
                    isLoggedIn: !!session?.user?.id,
                })
            } else if (event === "SIGNED_OUT") {
                setUser({
                    user_id: null,
                    isLoggedIn: false,
                })
            }
        })

        return () => {
            data.subscription.unsubscribe()
        }
    }, [])

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUser = () => {
    const context = useContext(UserContext)

    if (!context) {
        throw new Error("useUser must be used inside UserProvider")
    }

    return context
}
