import { useEffect, useState } from "react"
import { FormContext } from "./FormContext"

type Props = {
    children?: React.ReactNode
    initialValues?: Record<string, string>
    validate?: (values: Record<string, string>) => Record<string, string> | null
    onSubmit?: (values: Record<string, string>) => void
    className?: string
}

const Form = ({
    children,
    validate,
    initialValues = {},
    onSubmit,
    className,
}: Props) => {
    const [values, setValues] = useState<Record<string, string>>(initialValues)
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
