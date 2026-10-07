import { FormItem } from "@/components"
import { Input } from "@/components/ui"
import styles from "./UserInformation.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons"

type Props = {}

const UserInformation = ({}: Props) => {
    return (
        <div className={styles["info-container"]}>
            <div className={styles["group-info"]}>
                <span className="bold">CONTACT INFORMATION</span>
                <FormItem
                    label="Email"
                    name="email"
                    required
                    render={(props) => (
                        <Input {...props} placeholder="admin@gmail.com" />
                    )}
                />
                <FormItem
                    label="Full Name"
                    name="full_name"
                    required
                    render={(props) => (
                        <Input {...props} placeholder="Nguyen Van A" />
                    )}
                />
            </div>
            <div className={styles["group-info"]}>
                <span className="bold">SHIPPING ADDRESS</span>
                <FormItem
                    label="Street Address"
                    name="address"
                    required
                    render={(props) => (
                        <Input {...props} placeholder="Street 1" />
                    )}
                />
                <FormItem
                    label="City"
                    name="city"
                    required
                    render={(props) => <Input {...props} placeholder="City" />}
                />
                <div className={styles["country-info"]}>
                    <span>Country</span>
                    <img
                        src="https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/assets/flag-vn.svg"
                        alt="Country"
                        className={styles["country-flag"]}
                    />
                </div>
            </div>

            <div className={styles["group-info"]}>
                <span className="bold">PAYMENT METHOD</span>
                <div className={styles["cod-method"]}>
                    <FontAwesomeIcon
                        icon={faHandHoldingDollar}
                        className={styles["cod-icon"]}
                    />
                    <span>Cash on Delivery</span>
                </div>
            </div>
        </div>
    )
}

export default UserInformation
