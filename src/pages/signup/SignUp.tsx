import { useLocation } from "react-router"
import { Form, FormItem } from "@/components"
import { Input, Button } from "@/components/ui"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { signUp, type SignUpRequest } from "@/apis/auth/signUp"
import { QUERY_KEY_USER } from "@/apis/auth/getCurrentUserId"
import { useToast } from "@/contexts/ToastContext"
import styles from "./SignUp.module.css"

const SignUp = () => {
    const { showToast } = useToast()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const location = useLocation()
    const action = location.state

    const { mutate: signUpMutation } = useMutation({
        mutationFn: signUp,
        onSuccess: (data) => {
            showToast({ message: "Sign up successful", variant: "success" })
            queryClient.setQueryData([QUERY_KEY_USER], data.user)
            navigate("/login", {
                state: action,
            })
        },
        onError: () => {
            showToast({ message: "Sign up failed", variant: "error" })
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

    const handleSubmit = async (values: SignUpRequest) => {
        signUpMutation(values)
    }

    return (
        <div className={`${styles["signup-container"]} page-padding`}>
            <Form
                validate={validate}
                initialValues={{ email: "", password: "" }}
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
