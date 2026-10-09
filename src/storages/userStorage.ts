const USER_STORAGE_KEY = "user_id"

export const getUserStorage = (): string => {
    const data = localStorage.getItem(USER_STORAGE_KEY)
    return data || ""
}

export const setUserStorage = (newUserId: string) => {
    localStorage.setItem(USER_STORAGE_KEY, newUserId)
}
