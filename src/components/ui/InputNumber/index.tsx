import Input from "../Input";

const STEP = 1
const MIN = 1
const MAX = 99

type Props = {
    value: number
    max: number
    onChange: (value: number) => void
};

const InputNumber = ({
    value,
    max = MAX,
    onChange,
}: Props) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value

        if (input === "") {
            return
        }

        const number = Number(input);

        if (!Number.isInteger(number)) {
            return;
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
        />
    )
}

export default InputNumber