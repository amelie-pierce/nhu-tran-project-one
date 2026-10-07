import { useContext, createContext } from "react"

type FormContextType = {
    values: Record<string, string>
    errors: Record<string, string> | null
    onValuesChange: (name: string, value: string) => void
}

export const FormContext = createContext<FormContextType | null>(null)

export const useForm = () => {
    const context = useContext(FormContext)

    if (!context) {
        throw new Error("useForm must be used within Form")
    }

    return context
}
