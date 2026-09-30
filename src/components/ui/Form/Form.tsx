import { useEffect, useState } from "react"
import { FormContext } from "./FormContext"

type Props<T extends Record<string, string>> = {
    children?: React.ReactNode
    initialValues?: T
    validate?: (values: T) => Record<string, string> | null
    onSubmit?: (values: T) => void
    className?: string
}

const Form = <T extends Record<string, string>>({
    children,
    validate,
    initialValues = {} as T,
    onSubmit,
    className,
}: Props<T>) => {
    const [values, setValues] = useState<T>(initialValues)
    const [errors, setErrors] = useState<Record<string, string> | null>(null)

    useEffect(() => {
        setValues(initialValues)
    }, [initialValues])

    const onValuesChange = (name: string, value: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            [name]: value,
        }))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const newErrors = validate ? validate(values) : null
        setErrors(newErrors)

        const hasErrors = newErrors && Object.keys(newErrors).length > 0
        if (!hasErrors) {
            onSubmit?.(values)
        }
    }

    return (
        <FormContext.Provider
            value={{
                values,
                errors,
                onValuesChange,
            }}
        >
            <form className={className} onSubmit={handleSubmit}>
                {children}
            </form>
        </FormContext.Provider>
    )
}

export default Form
