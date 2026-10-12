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
import type { UserCompare } from "@/types/compare"
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
import type { Product } from "@/types/product"

type UserDataType = {
    cartList: CartProduct[]
    compareList: UserCompare[]
    updateCartList: (id: number, quantity: number) => void
    addToCartList: (id: number, quantity: number) => void
    removeFromCartList: (id: number) => void
    toggleCompareItem: (product?: Product) => void
    removeAllCompareItems: () => void
    isCartFetching: boolean
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

    const { data: userCart, isFetching: isCartFetching } = useQuery({
        queryKey: [QUERY_KEY_USER_CART],
        queryFn: getUserCart,
        // staleTime: 1000 * 60 * 5,
        enabled: isLoggedIn,
    })

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

    const updateCartList = (product_id: number, quantity: number) => {
        debouncedUpdateCart(product_id, quantity)
        setCartList((prevCartList) =>
            prevCartList?.map((item) =>
                item.id === product_id
                    ? {
                          ...item,
                          quantity,
                      }
                    : item
            )
        )
    }

    const addToCartList = useCallback(
        async (product_id: number, quantity: number) => {
            let lastestCartList = [...cartList]
            //TODO: find another way
            const carts = await getUserCart()
            lastestCartList = pareCartAPIResponse(carts)

            const isSuccess = checkConditionAddToCart(
                product_id,
                quantity,
                lastestCartList
            )
            if (!isSuccess) return

            const existingItem = lastestCartList?.find(
                (item) => item.id === product_id
            )
            if (existingItem) {
                updateCartList(product_id, existingItem.quantity + quantity)
            } else {
                setCartList((prevCartList) => [
                    ...prevCartList,
                    {
                        id: product_id,
                        quantity,
                    },
                ])
                createCart({
                    product_id,
                    quantity,
                })
            }
        },
        [cartList, checkConditionAddToCart, createCart, updateCartList]
    )

    const removeFromCartList = (product_id: number) => {
        deleteCart([product_id])
        setCartList((prevCartList) =>
            prevCartList.filter((item) => item.id !== product_id)
        )
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
