import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App from "./App.tsx"
import { ToastProvider } from "./components/ui/Toast/ToastContext.tsx"
import { UserDataProvider } from "./contexts/UserDataContext.tsx"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <UserDataProvider>
                    <ToastProvider>
                        <App />
                    </ToastProvider>
                </UserDataProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
)
