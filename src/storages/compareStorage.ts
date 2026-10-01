const COMPARE_STORAGE_KEY = "compare"

export const getCompare = (): number[] => {
    const data = localStorage.getItem(COMPARE_STORAGE_KEY)
    return data ? JSON.parse(data) : []
}

export const toggleCompare = (id: number): number[] => {
    const compare = getCompare()

    const newCompare = compare.includes(id)
        ? compare.filter((item) => item !== id)
        : [...compare, id]

    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(newCompare))

    return newCompare
}
