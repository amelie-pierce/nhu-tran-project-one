import { useState } from 'react'
import Input from '../Input'

const STEP = 1
const MIN = 1
const MAX = 99

const InputNumber = () => {
    const [value, setValue] = useState("1")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value

        if (input === "") {
            setValue(String(MIN))
            return
        }

        const number = Number(input)

        if (!Number.isInteger(number)) {
            return;
        }

        if (number > MAX) {
            setValue(String(MAX))
            return
        }

        if (number < MIN) {
            setValue(String(MIN))
            return
        }

        setValue(String(number))
    }

    return (
        <Input
            type="number"
            inputMode="numeric"
            min={MIN}
            max={MAX}
            step={STEP}
            value={value}
            onChange={handleChange}
        />
    )
}

export default InputNumber