import type { Contact } from "@/types/user"

const USER_STORAGE_KEY = "user_info"

export const getUserInfoStorage = (): Partial<Contact> => {
    const userInfo = localStorage.getItem(USER_STORAGE_KEY)
    return userInfo ? JSON.parse(userInfo) : {}
}

export const setUserInfoStorage = (userInfo: Partial<Contact>) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userInfo))
}
