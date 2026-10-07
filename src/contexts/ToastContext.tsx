import { createContext, useContext, useState } from "react"
import styles from "@/components/Toast/Toast.module.css"
import { Toast } from "@/components"

type Variant = "success" | "warning" | "error"

type ToastData = {
    id?: number
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
            id: Date.now(),
            message,
            variant,
        })

        setTimeout(() => {
            setToast(null)
        }, 3000)
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {toast && (
                <div className={styles.container}>
                    <Toast
                        key={toast.id}
                        variant={toast.variant}
                        onClose={() => setToast(null)}
                    >
                        {toast.message}
                    </Toast>
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
