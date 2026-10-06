import Form from "../../components/ui/Form/Form"
import { useLocation, Navigate } from "react-router"
import styles from "./Checkout.module.css"
import OrderSummary from "./components/OrderSummary/OrderSummary"
import UserInformation from "./components/UserInformation/UserInformation"
import { getUserInfo, setUserInfo } from "../../storages/userStorage"
import type { Contact } from "../../types/user"
import Breadcrumb from "../../components/ui/Breadcrumb/Breadcrumb"

const Checkout = () => {
    const contactInfo = getUserInfo()
    const location = useLocation()
    const state = location.state

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
        setUserInfo(values)
    }

    if (!state) {
        return <Navigate to="/" />
    }

    return (
        <>
            <Breadcrumb title="CHECKOUT" currentPage="Checkout" />
            <Form
                initialValues={contactInfo}
                validate={validate}
                onSubmit={handleSubmit}
                className={`${styles["wrapper"]} page-padding`}
            >
                <UserInformation />
                <OrderSummary orderItems={state} />
            </Form>
        </>
    )
}

export default Checkout
