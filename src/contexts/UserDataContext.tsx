import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"
import { useUser } from "@/contexts/UserContext"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEY_USER_CART } from "@/apis/cart/getUserCart"
import type { CartProduct, UserCart } from "@/types/cart"
import type { UserCompare } from "@/types/compare"
import {
    getCompareStorage,
    removeAllCompareStorage,
    toggleCompareStorage,
} from "@/storages/compareStorage"
import { useToast } from "@/contexts/ToastContext"
import { getUserCart } from "@/apis/cart/getUserCart"
import { updateUserCart } from "@/apis/cart/updateUserCart"
import { deleteUserCart } from "@/apis/cart/deleteUserCart"
import { useFeatureFlags } from "@/hooks/useFeatureFlags"
import {
    getUserCompare,
    QUERY_KEY_USER_COMPARE,
} from "@/apis/compare/getUserCompare"
import { deleteUserCompare } from "@/apis/compare/deleteUserCompare"
import { createUserCompare } from "@/apis/compare/createUserCompare"
import type { Product } from "@/types/product"
import { upsertUserCart } from "@/apis/cart/upsertUserCart"

type UserDataType = {
    cartList: CartProduct[]
    compareList: UserCompare[]
    updateCartList: (
        id: number,
        quantity: number,
        debounceEnabled?: boolean
    ) => void
    addToCartList: (product: CartProduct, quantity: number) => Promise<void>
    removeFromCartList: (id: number) => void
    toggleCompareItem: (product?: Product) => void
    removeAllCompareItems: () => void
    isCartFetching: boolean
    isCartError: boolean
    isCompareFetching: boolean
}

const UserDataContext = createContext<UserDataType | null>(null)

type Props = {
    children: React.ReactNode
}

export const UserDataProvider = ({ children }: Props) => {
    const { isDBCompareEnabled, maxQtyPerProduct } = useFeatureFlags()
    const [cartList, setCartList] = useState<CartProduct[]>([])
    const [compareList, setCompareList] =
        useState<UserCompare[]>(getCompareStorage())
    const { showToast } = useToast()
    const { isLoggedIn } = useUser()

    const queryClient = useQueryClient()

    const {
        data: userCart,
        isFetching: isCartFetching,
        isError: isCartError,
    } = useQuery({
        queryKey: [QUERY_KEY_USER_CART],
        queryFn: getUserCart,
        // staleTime: 1000 * 60 * 5,
        enabled: isLoggedIn,
    })

    const { mutateAsync: upsertCartAsync } = useMutation({
        mutationFn: upsertUserCart,
        onSuccess: (data) => {
            const updatedItem = data?.[0]
            if (!updatedItem) return

            setCartList((prevCartList) => {
                const exists = prevCartList.some(
                    (item) => item.id === updatedItem.product_id
                )

                if (exists) {
                    return prevCartList.map((item) =>
                        item.id === updatedItem.product_id
                            ? { ...item, quantity: updatedItem.quantity }
                            : item
                    )
                } else {
                    return [
                        ...prevCartList,
                        {
                            ...updatedItem.product,
                            id: updatedItem.product_id,
                            quantity: updatedItem.quantity,
                        },
                    ]
                }
            })

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

    const { mutate: deleteCart } = useMutation({
        mutationFn: deleteUserCart,
        onSuccess: (data) => {
            setCartList((prevCartList) =>
                prevCartList.filter((item) => item.id !== data?.[0]?.product_id)
            )
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

    const pareCartAPIResponse = (cartList?: UserCart[]): CartProduct[] => {
        return (
            cartList?.map((item) => ({
                ...item.product,
                quantity: item.quantity,
            })) ?? []
        )
    }

    useEffect(() => {
        if (isLoggedIn) {
            setCartList(pareCartAPIResponse(userCart))
        }
    }, [userCart, isLoggedIn])

    const { data: userCompare, isFetching: isCompareFetching } = useQuery({
        queryKey: [QUERY_KEY_USER_COMPARE],
        queryFn: getUserCompare,
        // staleTime: 1000 * 60 * 5,
        enabled: isDBCompareEnabled && isLoggedIn,
    })

    const { mutate: createCompare } = useMutation({
        mutationFn: createUserCompare,
        onSuccess: () => {
            // queryClient.invalidateQueries({
            //     queryKey: [QUERY_KEY_USER_COMPARE],
            // })
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
            // queryClient.invalidateQueries({
            //     queryKey: [QUERY_KEY_USER_COMPARE],
            // })
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
            setCompareList(userCompare ?? [])
        } else {
            setCompareList(getCompareStorage())
        }
    }, [userCompare, isDBCompareEnabled, isLoggedIn])

    const checkConditionAddToCart = (
        productId: number,
        quantity: number,
        lastestCartList?: CartProduct[]
    ): boolean => {
        if (!productId) return false
        const itemInCart = lastestCartList?.find(
            (item) => item.id === productId
        )
        const quantityInCart = itemInCart?.quantity || 0
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

    // Note: AI guide to fix TC-44
    const cartTimers = useRef<any>({})

    const updateCartList = useCallback(
        (product_id: number, quantity: number, debounceEnabled?: boolean) => {
            if (!quantity || !product_id) return

            setCartList((prevCartList) =>
                prevCartList?.map((item) =>
                    item.id === product_id ? { ...item, quantity } : item
                )
            )

            if (debounceEnabled) {
                if (cartTimers.current[product_id]) {
                    clearTimeout(cartTimers.current[product_id])
                }

                cartTimers.current[product_id] = setTimeout(() => {
                    updateCart({
                        product_id,
                        quantity,
                    })
                }, 1000)
            } else {
                updateCart({
                    product_id,
                    quantity,
                })
            }
        },
        [updateCart]
    )

    const addToCartList = useCallback(
        async (product: CartProduct, quantity: number) => {
            const productId = product.id || 0

            const isSuccess = checkConditionAddToCart(
                productId,
                quantity,
                cartList
            )
            if (!isSuccess) return

            const existingItem = cartList.find((item) => item.id === productId)

            const finalQuantity = existingItem
                ? existingItem.quantity + quantity
                : quantity

            await upsertCartAsync({
                product_id: productId,
                quantity: finalQuantity,
            })
        },
        [cartList, checkConditionAddToCart, upsertCartAsync]
    )

    const removeFromCartList = (product_id: number) => {
        deleteCart([product_id])
    }

    const addToCompareListDB = (product: Product) => {
        createCompare({ product_id: product.id })
        setCompareList((prevCompareList) => [
            ...prevCompareList,
            { product_id: product.id, product: product },
        ])
    }

    const removeFromCompareListDB = (product: Product) => {
        deleteCompare(product.id)
        setCompareList((prevCompareList) =>
            prevCompareList.filter((item) => item.product_id !== product.id)
        )
    }

    const toggleCompareItem = (product?: Product) => {
        if (!product) return

        const newCompareList = toggleCompareStorage(product)

        if (isDBCompareEnabled && isLoggedIn) {
            if (compareList.some((item) => item.product_id === product.id)) {
                removeFromCompareListDB(product)
            } else {
                addToCompareListDB(product)
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
                isCompareFetching,
                isCartFetching,
                isCartError,
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
