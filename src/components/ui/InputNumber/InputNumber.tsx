import { Input } from "@/components/ui"

const STEP = 1
const MIN = 1
const MAX = 99

type Props = {
    defaultValue?: number | string
    value: number | string
    max?: number
    onChange: (value: number | string) => void
    className?: string
}

const InputNumber = ({
    defaultValue,
    value,
    max = MAX,
    onChange,
    ...props
}: Props) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value

        if (input === "") {
            onChange("")
            return
        }

        if (!/^\d+$/.test(input)) {
            return
        }

        const number = Number(input)

        if (number > max) {
            onChange(max)
            return
        }

        onChange(number)
    }

    const handleBlur = () => {
        if (value === "") {
            onChange(defaultValue ?? MIN)
            return
        }

        const number = Number(value)

        if (number > max) {
            onChange(max)
            return
        }

        if (number < MIN) {
            onChange(MIN)
            return
        }

        onChange(number)
    }

    return (
        <Input
            type="text"
            inputMode="numeric"
            min={MIN}
            max={max}
            step={STEP}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
        />
    )
}

export default InputNumber
