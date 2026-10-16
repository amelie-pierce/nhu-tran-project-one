import { useState, useEffect } from "react"
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
    allowClear?: boolean
}

const InputNumber = ({
    defaultValue,
    value,
    max = MAX,
    onChange,
    allowClear = true,
    ...props
}: Props) => {
    const [localValue, setLocalValue] = useState<number | string>(value)

    const updateValue = (newValue: number | string) => {
        setLocalValue(newValue)
        onChange(newValue)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value

        if (input === "") {
            if (allowClear) {
                updateValue("")
            } else {
                setLocalValue("")
            }
            return
        }

        if (!/^\d+$/.test(input)) {
            return
        }

        const number = Number(input)

        if (number > max) {
            updateValue(max)
            return
        }

        updateValue(number)
    }

    const handleBlur = () => {
        if (localValue === "") {
            updateValue(defaultValue ?? MIN)
            return
        }

        const number = Number(localValue)

        if (number > max) {
            updateValue(max)
            return
        }

        if (number < MIN) {
            updateValue(MIN)
            return
        }

        updateValue(number)
    }

    useEffect(() => {
        setLocalValue(value)
    }, [value])

    return (
        <Input
            type="text"
            inputMode="numeric"
            min={MIN}
            max={max}
            step={STEP}
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
        />
    )
}

export default InputNumber
