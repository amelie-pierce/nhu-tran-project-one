import { Form, Breadcrumb } from "@/components"
import { useLocation, Navigate } from "react-router"
import { OrderSummary, UserInformation } from "./components"
import type { Contact } from "@/types/contact"
import styles from "./Checkout.module.css"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { upsertUserContact } from "@/apis/contact/upsertUserContact"
import { QUERY_KEY_USER_CONTACT } from "@/apis/contact/getUserContact"
import { useToast } from "@/contexts/ToastContext"

const Checkout = () => {
    const location = useLocation()
    const state = location.state
    const queryClient = useQueryClient()
    const { showToast } = useToast()

    const { mutate: upsertContact, isPending } = useMutation({
        mutationFn: upsertUserContact,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY_USER_CONTACT],
            })
        },
        onError: (error) => {
            showToast({
                message: (error as Error).message,
                variant: "error",
            })
        },
    })

    const validate = (values: Partial<Contact>) => {
        const errors: Record<string, string> = {}

        if (!values.email) {
            errors.email = "Email is required"
        }
        if (!values.full_name) {
            errors.full_name = "Full Name is required"
        }
        if (!values.address) {
            errors.address = "Street Address is required"
        }
        if (!values.city) {
            errors.city = "City is required"
        }

        return errors
    }

    const handleSubmit = (values: Partial<Contact>) => {
        upsertContact(values)
    }

    if (!state) {
        return <Navigate to="/" />
    }

    return (
        <>
            <Breadcrumb title="CHECKOUT" currentPage="Checkout" />
            <Form
                validate={validate}
                onSubmit={handleSubmit}
                className={`${styles["wrapper"]} page-padding`}
            >
                <UserInformation />
                <OrderSummary
                    orderItems={state?.items || []}
                    isPending={isPending}
                />
            </Form>
        </>
    )
}

export default Checkout
