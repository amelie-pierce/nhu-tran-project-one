import styles from "./Form.module.css"

export type ComponentProps = {
    name: string
    defaultValue?: string
}

type Props = {
    label: string
    name: string
    required?: boolean
    defaultValue?: string
    render: (props: ComponentProps) => React.ReactNode
}

const FormItem = ({
    label,
    name,
    required,
    defaultValue = "",
    render,
}: Props) => {
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
                    name,
                    defaultValue,
                })}

                <div
                    id={`error-${name}`}
                    className={`form-item-error ${styles["form-item-error"]}`}
                />
            </div>
        </div>
    )
}

export default FormItem
