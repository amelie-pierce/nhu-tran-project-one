import { useForm } from "./FormContext"
import styles from "./Form.module.css"

type ComponentProps = {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
}

type Props = {
    label: string
    name: string
    required?: boolean
    render: (props: ComponentProps) => React.ReactNode
}

const FormItem = ({ label, name, required, render }: Props) => {
    const { values, errors, onValuesChange } = useForm()

    return (
        <div className={styles["form-item"]}>
            <div className={styles["form-item-label"]}>
                <span>{label}</span>
                {required && (
                    <span className={styles["form-item-required"]}>*</span>
                )}
            </div>

            <div className={styles["form-item-input"]}>
                {render({
                    value: values[name] || "",
                    onChange: (e) => onValuesChange(name, e.target.value),
                })}

                {errors && (
                    <div className={styles["form-item-error"]}>
                        {errors[name]}
                    </div>
                )}
            </div>
        </div>
    )
}

export default FormItem
