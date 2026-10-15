import { Navigate, useLocation } from "react-router"
import { Form, FormItem } from "@/components"
import { Input, Button } from "@/components/ui"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { signUp, type SignUpRequest } from "@/apis/auth/signUp"
import { useToast } from "@/contexts/ToastContext"
import styles from "./SignUp.module.css"
import { validateEmail } from "@/utils/validateEmail"
import { useUser } from "@/contexts/UserContext"
import { useRef } from "react"
import { useFeatureFlags } from "@/hooks/useFeatureFlags"

const SignUp = () => {
    const { showToast } = useToast()
    const navigate = useNavigate()
    const { isLoggedIn } = useUser()
    const isRedirectingRef = useRef(false)
    const { isSignupEnabled } = useFeatureFlags()

    const location = useLocation()
    const action = location.state

    const { mutate: signUpMutation } = useMutation({
        mutationFn: signUp,
        onSuccess: () => {
            showToast({ message: "Sign up successful", variant: "success" })
            isRedirectingRef.current = true
            navigate("/login", {
                state: { ...action, fromSignup: true },
            })
        },
        onError: (error) => {
            showToast({
                message: error?.message ?? "Sign up failed",
                variant: "error",
            })
        },
    })

    const validate = (values: Record<string, string>) => {
        const errors: Record<string, string> = {}

        if (!values.email) {
            errors.email = "Email is required"
        }

        if (!validateEmail(values.email)) {
            errors.email = "Please enter a valid email address"
        }

        if (!values.password) {
            errors.password = "Password is required"
        }

        if (values.password && values.password.length < 6) {
            errors.password = "Password must be at least 6 characters"
        }

        return errors
    }

    const handleSubmit = async (values: SignUpRequest) => {
        signUpMutation(values)
    }

    if (!isSignupEnabled || (isLoggedIn && !isRedirectingRef.current)) {
        return <Navigate to={"/"} replace />
    }

    return (
        <div className={`${styles["signup-container"]} page-padding`}>
            <Form
                validate={validate}
                onSubmit={handleSubmit}
                className={styles["signup-form"]}
            >
                <h1 className="bold title">SIGN UP</h1>

                <div className={styles["signup-form-items-container"]}>
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
                <Button type="submit" className={styles["signup-button"]}>
                    Sign Up
                </Button>
            </Form>
        </div>
    )
}

export default SignUp
