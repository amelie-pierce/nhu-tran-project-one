import { createContext, useContext, useState } from "react"
import styles from "./Toast.module.css"
import Toast from "./Toast"

type Variant = "success" | "warning" | "error"

type ToastData = {
    message: string
    variant: Variant
}

type ToastContextType = {
    showToast: ({ message, variant }: ToastData) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

type Props = {
    children: React.ReactNode
}

export const ToastProvider = ({ children }: Props) => {
    const [toast, setToast] = useState<ToastData | null>(null)

    const showToast = ({ message, variant = "success" }: ToastData) => {
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
