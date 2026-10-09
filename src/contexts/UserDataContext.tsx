import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import { useUser } from "@/contexts/UserContext"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEY_USER_CART } from "@/apis/cart/getUserCart"
import type { CartProduct, UserCart } from "@/types/cart"
import {
    addToCartStorage,
    getCartStorage,
    removeFromCartStorage,
    updateCartStorage,
} from "@/storages/cartStorage"
import {
    getCompareStorage,
    removeAllCompareStorage,
    toggleCompareStorage,
} from "@/storages/compareStorage"
import { useToast } from "@/contexts/ToastContext"
import { getUserCart } from "@/apis/cart/getUserCart"
import { createUserCart } from "@/apis/cart/createUserCart"
import { updateUserCart } from "@/apis/cart/updateUserCart"
import { deleteUserCart } from "@/apis/cart/deleteUserCart"
import { debounce } from "@/utils/debounce"
import { useFeatureFlags } from "@/hooks/useFeatureFlags"
import {
    getUserCompare,
    QUERY_KEY_USER_COMPARE,
} from "@/apis/compare/getUserCompare"
import { deleteUserCompare } from "@/apis/compare/deleteUserCompare"
import { createUserCompare } from "@/apis/compare/createUserCompare"

type UserDataType = {
    cartList: CartProduct[]
    compareList: number[]
    updateCartList: (
        id: number,
        quantity: number,
        checkCondition: boolean
    ) => void
    addToCartList: (
        id: number,
        quantity: number,
        isLoggedInBefore?: boolean
    ) => void
    removeFromCartList: (id: number) => void
    toggleCompareItem: (id: number) => void
    removeAllCompareItems: () => void
    isCartFetching: boolean
    isCartLoading: boolean
    isCartError: boolean
}

const UserDataContext = createContext<UserDataType | null>(null)

type Props = {
    children: React.ReactNode
}

export const UserDataProvider = ({ children }: Props) => {
    const { isDBCartEnabled, isDBCompareEnabled, maxQtyPerProduct } =
        useFeatureFlags()
    const [localCartList, setLocalCartList] =
        useState<CartProduct[]>(getCartStorage())
    const [compareList, setCompareList] =
        useState<number[]>(getCompareStorage())
    const { showToast } = useToast()
    const { isLoggedIn } = useUser()

    const queryClient = useQueryClient()

    const {
        data: userCart,
        isLoading: isCartLoading,
        isError: isCartError,
        isFetching: isCartFetching,
    } = useQuery({
        queryKey: [QUERY_KEY_USER_CART],
        queryFn: getUserCart,
        enabled: isDBCartEnabled && isLoggedIn,
    })

    const pareCartAPIResponse = (cartList?: UserCart[]): CartProduct[] => {
        return (
            cartList?.map((item) => ({
                ...item.product,
                quantity: item.quantity,
            })) ?? []
        )
    }

    const dbCartList = useMemo(() => pareCartAPIResponse(userCart), [userCart])

    const cartList = isDBCartEnabled ? dbCartList : localCartList

    const { mutate: createCart } = useMutation({
        mutationFn: createUserCart,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY_USER_CART],
            })
        },
        onError: (error) => {
            showToast({
                message: (error as Error).message,
                variant: "error",
            })
        },
    })

    const { mutate: updateCart } = useMutation({
        mutationFn: updateUserCart,
        // onSuccess: () => {
        //     queryClient.invalidateQueries({
        //         queryKey: [QUERY_KEY_USER_CART],
        //     })
        // },
        onError: (error) => {
            showToast({
                message: (error as Error).message,
                variant: "error",
            })
        },
    })

    const { mutate: deleteCart } = useMutation({
        mutationFn: deleteUserCart,
        // onSuccess: () => {
        //     queryClient.invalidateQueries({
        //         queryKey: [QUERY_KEY_USER_CART],
        //     })
        // },
        onError: (error) => {
            showToast({
                message: (error as Error).message,
                variant: "error",
            })
        },
    })

    const { data: userCompare } = useQuery({
        queryKey: [QUERY_KEY_USER_COMPARE],
        queryFn: getUserCompare,
        enabled: isDBCompareEnabled && isLoggedIn,
    })

    const { mutate: createCompare } = useMutation({
        mutationFn: createUserCompare,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY_USER_COMPARE],
            })
        },
        onError: (error) => {
            showToast({
                message: (error as Error).message,
                variant: "error",
            })
        },
    })

    const { mutate: deleteCompare } = useMutation({
        mutationFn: deleteUserCompare,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY_USER_COMPARE],
            })
        },
        onError: (error) => {
            showToast({
                message: (error as Error).message,
                variant: "error",
            })
        },
    })

    useEffect(() => {
        if (isDBCompareEnabled && isLoggedIn) {
            setCompareList(userCompare?.map((item) => item.product_id) ?? [])
        } else {
            setCompareList(getCompareStorage())
        }
    }, [userCompare, isDBCompareEnabled, isLoggedIn])

    const checkConditionAddToCart = (
        productId: number,
        quantity: number,
        currentCartList: CartProduct[]
    ): boolean => {
        const itemInCart = currentCartList.find((item) => item.id === productId)
        const quantityInCart = itemInCart?.quantity ?? 0
        const maxAddable = maxQtyPerProduct - quantityInCart

        if (quantity <= maxAddable) {
            showToast({
                message: "Added to cart successfully",
                variant: "success",
            })
            return true
        }

        if (maxAddable === 0) {
            showToast({
                message:
                    "Your cart already contains the maximum quantity for this product.",
                variant: "error",
            })
            return false
        }

        if (quantity > maxAddable) {
            showToast({
                message: `Your cart already has ${quantityInCart} items. You can add up to ${maxAddable} more.`,
                variant: "warning",
            })
            return false
        }

        return false
    }

    const debouncedUpdateCart = useMemo(
        () =>
            debounce((product_id: number, quantity: number) => {
                if (!quantity || !product_id) return
                updateCart({
                    product_id,
                    quantity,
                })
            }, 1000),
        [updateCart]
    )

    const updateCartList = (
        product_id: number,
        quantity: number,
        checkCondition = true
    ) => {
        if (
            checkCondition &&
            !checkConditionAddToCart(product_id, quantity, cartList)
        ) {
            return
        }

        if (isDBCartEnabled) {
            queryClient.setQueryData<UserCart[]>([QUERY_KEY_USER_CART], (old) =>
                old?.map((item) =>
                    item.product_id === product_id
                        ? {
                              ...item,
                              quantity,
                          }
                        : item
                )
            )

            debouncedUpdateCart(product_id, quantity)
            return
        }

        setLocalCartList((prev) => {
            updateCartStorage(prev, product_id, quantity)
            return prev.map((item) =>
                item.id === product_id
                    ? {
                          ...item,
                          quantity,
                      }
                    : item
            )
        })
    }

    const addToCartList = useCallback(
        async (
            product_id: number,
            quantity: number,
            isLoggedInBefore = true
        ) => {
            let latestCartList = [...cartList]

            if (!isLoggedInBefore) {
                const carts = await getUserCart()
                latestCartList = pareCartAPIResponse(carts)
            }

            const isSuccess = checkConditionAddToCart(
                product_id,
                quantity,
                latestCartList
            )

            if (!isSuccess) return

            const existingItem = latestCartList.find(
                (item) => item.id === product_id
            )
            if (existingItem) {
                updateCartList(
                    product_id,
                    existingItem.quantity + quantity,
                    false
                )
                return
            }

            if (isDBCartEnabled) {
                createCart({
                    product_id,
                    quantity,
                })
                return
            }

            setLocalCartList((prevCartList) => {
                addToCartStorage(prevCartList, product_id, quantity)
                return [
                    ...prevCartList,
                    {
                        id: product_id,
                        quantity,
                    },
                ]
            })
        },
        [
            cartList,
            isDBCartEnabled,
            checkConditionAddToCart,
            updateCartList,
            createCart,
            pareCartAPIResponse,
        ]
    )

    const removeFromCartList = (product_id: number) => {
        if (isDBCartEnabled) {
            queryClient.setQueryData<UserCart[]>(
                [QUERY_KEY_USER_CART],
                (old = []) =>
                    old.filter((item) => item.product_id !== product_id)
            )

            deleteCart([product_id])

            return
        }

        setLocalCartList((prev) => {
            removeFromCartStorage(prev, product_id)

            return prev.filter((item) => item.id !== product_id)
        })
    }

    const addToCompareListDB = (product_id: number) => {
        createCompare({ product_id })
        setCompareList((prevCompareList) => [...prevCompareList, product_id])
    }

    const removeFromCompareListDB = (product_id: number) => {
        deleteCompare(product_id)
        setCompareList((prevCompareList) =>
            prevCompareList.filter((item) => item !== product_id)
        )
    }

    const toggleCompareItem = (product_id: number) => {
        const newCompareList = toggleCompareStorage(product_id)

        if (isDBCompareEnabled && isLoggedIn) {
            if (compareList.includes(product_id)) {
                removeFromCompareListDB(product_id)
            } else {
                addToCompareListDB(product_id)
            }
        } else {
            setCompareList(newCompareList)
        }
    }

    const removeAllCompareItems = () => {
        if (isDBCompareEnabled && isLoggedIn) {
            deleteCompare()
        }
        removeAllCompareStorage()
        setCompareList([])
    }

    return (
        <UserDataContext.Provider
            value={{
                cartList,
                compareList,
                updateCartList,
                addToCartList,
                removeFromCartList,
                toggleCompareItem,
                removeAllCompareItems,
                isCartLoading,
                isCartError,
                isCartFetching,
            }}
        >
            {children}
        </UserDataContext.Provider>
    )
}

export const useUserData = () => {
    const context = useContext(UserDataContext)

    if (!context) {
        throw new Error("useUserData must be used inside UserDataProvider")
    }

    return context
}
