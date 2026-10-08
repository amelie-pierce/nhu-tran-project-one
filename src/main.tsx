import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App from "@/App.tsx"
import { ToastProvider } from "@/contexts/ToastContext.tsx"
import { UserDataProvider } from "@/contexts/UserDataContext.tsx"
import flagsmith from "@flagsmith/flagsmith"
import { FlagsmithProvider } from "@flagsmith/flagsmith/react"
import { UserProvider } from "./contexts/UserContext"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <FlagsmithProvider
                options={{
                    environmentID: import.meta.env
                        .VITE_FLAGSMITH_ENVIRONMENT_ID,
                }}
                flagsmith={flagsmith}
            >
                <BrowserRouter>
                    <ToastProvider>
                        <UserProvider>
                            <UserDataProvider>
                                <App />
                            </UserDataProvider>
                        </UserProvider>
                    </ToastProvider>
                </BrowserRouter>
            </FlagsmithProvider>
        </QueryClientProvider>
    </StrictMode>
)
