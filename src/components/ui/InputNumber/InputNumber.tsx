import { Input } from "@/components/ui"

const STEP = 1
const MIN = 1
const MAX = 99

type Props = {
    value: number | string
    max?: number
    onChange: (value: number | string) => void
    className?: string
}

const InputNumber = ({ value, max = MAX, onChange, ...props }: Props) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value

        if (input === "") {
            onChange("")
            return
        }

        const number = Number(input)

        if (!Number.isInteger(number)) {
            return
        }

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
            type="number"
            inputMode="numeric"
            min={MIN}
            max={max}
            step={STEP}
            value={value}
            onChange={handleChange}
            onBlur={() => {
                if (value === "") {
                    onChange(MIN)
                }
            }}
            {...props}
        />
    )
}

export default InputNumber
