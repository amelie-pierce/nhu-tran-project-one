import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import styles from "./Payment.module.css"
import Button from "../../components/ui/Button/Button"

const Payment = () => {
    return (
        <div className={styles["payment-container"]}>
            <div className={styles["payment-content"]}>
                <FontAwesomeIcon
                    icon={faCircleCheck}
                    className={styles["payment-icon"]}
                />
                <span className="title bold">Payment successful</span>
            </div>
            <Button icon={<FontAwesomeIcon icon={faArrowRight} />}>
                Continue Shopping
            </Button>
        </div>
    )
}

export default Payment
