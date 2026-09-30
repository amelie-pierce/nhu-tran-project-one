import { createContext, useContext, useState, type ReactNode } from "react"
import Toast from "."
import styles from "../components/ui/Toast/Toast.module.css"

type Variant = "success" | "warning" | "error"

type ToastData = {
    message: string
    variant: Variant
}

type ToastContextType = {
    showToast: (message: string, variant?: Variant) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

type Props = {
    children: ReactNode
}

export const ToastProvider = ({ children }: Props) => {
    const [toast, setToast] = useState<ToastData | null>(null)

    const showToast = (message: string, variant: Variant = "success") => {
        setToast({
            message,
            variant,
        })
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {toast && (
                <div className={styles.container}>
                    <Toast variant={toast.variant}>{toast.message}</Toast>
                </div>
            )}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error("useToast must be used inside ToastProvider")
    }

    return context
}
