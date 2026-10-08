import { useCallback } from "react"
import { useLocation } from "react-router"
import { Form, FormItem } from "@/components"
import { Input, Button } from "@/components/ui"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { signIn, type SignInRequest } from "@/apis/auth/signIn"
import { QUERY_KEY_USER } from "@/apis/auth/getUser"
import { useToast } from "@/contexts/ToastContext"
import { useUserData } from "@/contexts/UserDataContext"
import styles from "./Login.module.css"
import { useFeatureFlags } from "@/hooks/useFeatureFlags"
import { getCartStorage } from "@/storages/cartStorage"
import { upsertUserCompare } from "@/apis/compare/upsertCompare"
import { QUERY_KEY_USER_COMPARE } from "@/apis/compare/getUserCompare"

const Login = () => {
    const { showToast } = useToast()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { isSignupEnabled } = useFeatureFlags()
    const { addToCartList } = useUserData()

    const location = useLocation()
    const action = location.state

    const { mutate: bulkUpsertCompare } = useMutation({
        mutationFn: upsertUserCompare,
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

    const handleRedirectAfterLogin = useCallback(() => {
        if (!action) {
            navigate("/")
            return
        }

        if (action.type === "add") {
            const item = action.items?.[0]
            addToCartList(item?.id, item?.quantity)
        }

        if (action.type === "buy") {
            navigate(action.redirectTo, { state: action })
        }
    }, [action, addToCartList, navigate])

    const syncCompareListToDB = useCallback(() => {
        const compareList = getCartStorage()
        if (!compareList.length) return

        bulkUpsertCompare({
            product_ids: compareList.map((item) => Number(item.id)),
        })
    }, [bulkUpsertCompare])

    const { mutate: signInMutation, isPending } = useMutation({
        mutationFn: signIn,
        onSuccess: (data) => {
            showToast({ message: "Login successful", variant: "success" })
            queryClient.setQueryData([QUERY_KEY_USER], data.user)
            syncCompareListToDB()
            handleRedirectAfterLogin()
        },
        onError: () => {
            showToast({ message: "Login failed", variant: "error" })
        },
    })

    const validate = (values: Record<string, string>) => {
        const errors: Record<string, string> = {}

        if (!values.email) {
            errors.email = "Email is required"
        }

        if (!values.password) {
            errors.password = "Password is required"
        }

        return errors
    }

    const handleSubmit = (values: SignInRequest) => {
        signInMutation(values)
    }

    return (
        <div className={`${styles["login-container"]} page-padding`}>
            <Form
                validate={validate}
                onSubmit={handleSubmit}
                className={styles["login-form"]}
            >
                <h1 className="bold title">LOGIN</h1>

                <div className={styles["login-form-items-container"]}>
                    <FormItem
                        label="Email"
                        name="email"
                        required
                        render={(props) => (
                            <Input
                                {...props}
                                placeholder="admin@gmail.com"
                                type="email"
                            />
                        )}
                    />
                    <FormItem
                        label="Password"
                        name="password"
                        required
                        render={(props) => (
                            <Input
                                {...props}
                                placeholder="••••••••"
                                type="password"
                            />
                        )}
                    />
                </div>
                <div className={styles["action-button-container"]}>
                    <Button
                        type="submit"
                        className={styles["login-button"]}
                        disabled={isPending}
                    >
                        Login
                    </Button>
                    {isSignupEnabled && (
                        <div className={styles["signup-container"]}>
                            <span>Don't have an account?</span>
                            <span
                                className={styles["signup-link"]}
                                onClick={() =>
                                    navigate("/signup", {
                                        state: action,
                                    })
                                }
                            >
                                Sign up
                            </span>
                        </div>
                    )}
                </div>
            </Form>
        </div>
    )
}

export default Login
