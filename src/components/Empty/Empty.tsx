import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui"
import styles from "./Empty.module.css"
import { useNavigate } from "react-router"

const Empty = ({ label = "cart" }: { label?: string }) => {
    const navigate = useNavigate()
    return (
        <div className={styles["empty-container"]}>
            <p className={styles["empty-text"]}>Your {label} is empty</p>
            <Button
                icon={<FontAwesomeIcon icon={faArrowRight} />}
                onClick={() => {
                    navigate("/product")
                }}
            >
                Browse to Product
            </Button>
        </div>
    )
}

export default Empty
