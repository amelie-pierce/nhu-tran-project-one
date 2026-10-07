import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faCircleCheck,
    faArrowRight,
    faCircleXmark,
} from "@fortawesome/free-solid-svg-icons"
import styles from "./Payment.module.css"
import { Button } from "@/components/ui"
import { Navigate, useLocation, useNavigate } from "react-router"

export type PaymentStatus = "error" | "success"

export type PaymentType = {
    status: PaymentStatus
}

const Payment = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as PaymentType

    if (!state) {
        return <Navigate to="/" />
    }

    return (
        <div
            className={styles["payment-container"]}
            style={{
                color:
                    state.status == "success"
                        ? "var(--color-green-600)"
                        : "var(--color-red-600)",
            }}
        >
            <div className={styles["payment-content"]}>
                <FontAwesomeIcon
                    icon={
                        state.status == "success"
                            ? faCircleCheck
                            : faCircleXmark
                    }
                    className={styles["payment-icon"]}
                />
                <span className="title bold">Payment successful</span>
            </div>
            <Button
                icon={<FontAwesomeIcon icon={faArrowRight} />}
                onClick={() => navigate("/product")}
            >
                Continue shopping
            </Button>
        </div>
    )
}

export default Payment
