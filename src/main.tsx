import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App from "@/App.tsx"
import { ToastProvider } from "@/contexts/ToastContext.tsx"
import { UserDataProvider } from "@/contexts/UserDataContext.tsx"
import { initFlagsmith } from "@/lib/flagsmith"

const queryClient = new QueryClient()

initFlagsmith().then(() => {
    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <ToastProvider>
                        <UserDataProvider>
                            <App />
                        </UserDataProvider>
                    </ToastProvider>
                </BrowserRouter>
            </QueryClientProvider>
        </StrictMode>
    )
})
