type Props<T extends Record<string, string>> = {
    children?: React.ReactNode
    validate?: (values: T) => Record<string, string> | null
    onSubmit?: (values: T) => void
    className?: string
}

const Form = <T extends Record<string, string>>({
    children,
    validate,
    onSubmit,
    className,
}: Props<T>) => {
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const values = Object.fromEntries(formData.entries()) as T

        const errors = validate?.(values) || null
        const hasErrors = errors && Object.keys(errors).length > 0

        document.querySelectorAll(".form-item-error").forEach((element) => {
            (element as HTMLElement).style.display = "none"
        })

        if (!hasErrors) {
            onSubmit?.(values)
        } else {
            Object.keys(errors).forEach((name) => {
                const errorElement = document.getElementById(`error-${name}`)
                if (errorElement) {
                    errorElement.textContent = errors[name]
                    errorElement.style.display = "block"
                }
            })
        }
    }

    return (
        <form className={className} onSubmit={handleSubmit}>
            {children}
        </form>
    )
}

export default Form
