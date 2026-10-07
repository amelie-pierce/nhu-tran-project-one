const COMPARE_STORAGE_KEY = "compare"

export const getCompareStorage = (): number[] => {
    const data = localStorage.getItem(COMPARE_STORAGE_KEY)
    return data ? JSON.parse(data) : []
}

export const toggleCompareStorage = (id: number): number[] => {
    const compare = getCompareStorage()

    const newCompare = compare.includes(id)
        ? compare.filter((item) => item !== id)
        : [...compare, id]

    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(newCompare))

    return newCompare
}

export const removeAllCompareStorage = () => {
    localStorage.removeItem(COMPARE_STORAGE_KEY)
}
