import { FormItem } from "@/components"
import { Input } from "@/components/ui"
import styles from "./UserInformation.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons"
import { useQuery } from "@tanstack/react-query"
import {
    getUserContact,
    QUERY_KEY_USER_CONTACT,
} from "@/apis/contact/getUserContact"
import { transformImage } from "@/utils/transformImage"
import { getImgSizeWidth } from "@/utils/getImgSizeWidth"

const UserInformation = () => {
    const { data: contactInfo, isFetching } = useQuery({
        queryKey: [QUERY_KEY_USER_CONTACT],
        queryFn: getUserContact,
        staleTime: 1000 * 60 * 5,
    })

    const flag =
        "https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/assets/flag-vn.svg"

    return (
        <div className={styles["info-container"]}>
            <div className={styles["group-info"]}>
                <span className="bold">CONTACT INFORMATION</span>
                <FormItem
                    label="Email"
                    name="email"
                    required
                    defaultValue={contactInfo?.email}
                    render={(props) => (
                        <Input
                            {...props}
                            placeholder="admin@gmail.com"
                            disabled={isFetching}
                        />
                    )}
                />
                <FormItem
                    label="Full Name"
                    name="full_name"
                    required
                    defaultValue={contactInfo?.full_name}
                    render={(props) => (
                        <Input
                            {...props}
                            placeholder="Nguyen Van A"
                            disabled={isFetching}
                        />
                    )}
                />
            </div>
            <div className={styles["group-info"]}>
                <span className="bold">SHIPPING ADDRESS</span>
                <FormItem
                    label="Street Address"
                    name="address"
                    required
                    defaultValue={contactInfo?.address}
                    render={(props) => (
                        <Input
                            {...props}
                            placeholder="Street 1"
                            disabled={isFetching}
                        />
                    )}
                />
                <FormItem
                    label="City"
                    name="city"
                    required
                    defaultValue={contactInfo?.city}
                    render={(props) => (
                        <Input
                            {...props}
                            placeholder="City"
                            disabled={isFetching}
                        />
                    )}
                />
                <div className={styles["country-info"]}>
                    <span>Country</span>
                    <img
                        src={flag}
                        srcSet={`
                            ${transformImage(flag, 24)} 24w,
                        `}
                        sizes={getImgSizeWidth(24, 24, 24, 24)}
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
