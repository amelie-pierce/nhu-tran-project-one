import styles from "./Login.module.css"
import Form from "../../components/ui/Form/Form"
import FormItem from "../../components/ui/Form/FormItem"
import Input from "../../components/ui/Input/Input"
import Button from "../../components/ui/Button/Button"
import { useMutation } from "@tanstack/react-query"
import { signIn, type SignInRequest } from "../../apis/auth/signIn"
import { useToast } from "../../components/ui/Toast/ToastContext"

const Login = () => {
    const { showToast } = useToast()

    const signInMutation = useMutation({
        mutationFn: signIn,
        onSuccess: (data) => {
            showToast({ message: "Login successful", variant: "error" })
        },
        onError: (error) => {
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

    const handleSubmit = async (values: SignInRequest) => {
        signInMutation.mutate(values)
    }

    return (
        <div className={styles["login-container"]}>
            <Form
                validate={validate}
                initialValues={{ email: "", password: "" }}
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
                <Button type="submit" className={styles["login-button"]}>
                    Login
                </Button>
            </Form>
        </div>
    )
}

export default Login
