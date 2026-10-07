import type { Contact } from "@/types/user"

const USER_STORAGE_KEY = "user_info"

export const getUserInfo = (): Partial<Contact> => {
    const userInfo = localStorage.getItem(USER_STORAGE_KEY)
    return userInfo ? JSON.parse(userInfo) : {}
}

export const setUserInfo = (userInfo: Partial<Contact>) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userInfo))
}
