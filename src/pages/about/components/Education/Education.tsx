import { Tag } from "@/components/ui"
import { MainPoint } from "@/pages/about/components"
import styles from "./Education.module.css"

const Education = () => {
    return (
        <div className={`page-padding ${styles.wrapper}`}>
            <div className="heading bold">Education Journey</div>
            <div className={styles["journey-container"]}>
                <img
                    src="https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/logo/logo_uit.png"
                    alt="UIT"
                    className={styles["uit-logo"]}
                />
                <div className={styles["journey"]}>
                    <div className={styles["journey-text"]}>
                        <span>I’m graduated at</span>
                        <span className="bold">
                            Vietnam National University Ho Chi Minh City -
                            University of Information Technology (UIT)
                        </span>
                    </div>
                    <div className={styles["journey-info"]}>
                        <Tag variant="light-purple">Information System</Tag>
                        <Tag variant="light-purple">Bachelor's degree</Tag>
                        <Tag variant="light-purple">2021-2025</Tag>
                    </div>
                </div>
            </div>
            <div className={styles["points-wrapper"]}>
                <MainPoint point="8.84" desc="GPA: 8.84/10" />
                <MainPoint point="2nd" desc="2nd-Highest GPA in Class" />
                <MainPoint point="4" desc="4 Academic Scholarships" />
                <MainPoint point="2" desc="2 Research Projects" />
            </div>
        </div>
    )
}

export default Education
