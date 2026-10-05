import Tag from "../../../../components/ui/Tag/Tag"
import styles from "./Scholarship.module.css"

const Scholarship = () => {
    return (
        <div className={`page-padding ${styles.wrapper}`}>
            <div className="heading bold">4 Academic Scholarships</div>
            <div className={styles["timeline-container"]}>
                <Tag variant="light-purple" className={styles.timeline}>
                    05/2022
                </Tag>
                <Tag variant="light-purple" className={styles.timeline}>
                    11/2022
                </Tag>
                <Tag variant="light-purple" className={styles.timeline}>
                    06/2023
                </Tag>
                <Tag variant="light-purple" className={styles.timeline}>
                    10/2023
                </Tag>
            </div>
        </div>
    )
}

export default Scholarship
