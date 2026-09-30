const COMPARE_STORAGE_KEY = "compare"

export const getCompare = (): number[] => {
    const data = localStorage.getItem(COMPARE_STORAGE_KEY)
    return data ? JSON.parse(data) : []
}

export const toggleCompare = (id: number) => {
    const compare = getCompare()
    if (compare.includes(id)) {
        const newCompare = compare.filter((item) => item !== id)
        localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(newCompare))
    } else {
        compare.push(id)
        localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compare))
    }
}
