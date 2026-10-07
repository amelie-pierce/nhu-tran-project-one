import { Tag } from "@/components/ui"
import styles from "./WorkExperience.module.css"

const WorkExperience = () => {
    return (
        <div className={`page-padding ${styles.wrapper}`}>
            <div className="heading bold">Work Experience</div>
            <div className={styles["exp-container"]}>
                <div className={styles["logo-container"]}>
                    <img
                        src="https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/logo/logo_hasaki.jpg"
                        alt="hasaki.vn"
                        className={styles["logo"]}
                    />
                </div>
                <div className={styles["exp-detail"]}>
                    <div className={styles["exp-info"]}>
                        <div className={styles["exp-title"]}>
                            <span className="bold">FRONTEND ENGINEER</span>
                            <span className={styles["exp-time"]}>
                                07/2025 - 09/2026
                            </span>
                        </div>
                        <span>
                            Developed and maintained internal applications,
                            primarily contributing to PLM and BOM projects for
                            product design and manufacturing management. Worked
                            mainly on frontend development while also
                            contributing to backend CRUD, reporting, and
                            integrations with Kafka, RabbitMQ, and
                            Elasticsearch.
                        </span>
                    </div>
                    <div className={styles.techstack}>
                        <Tag variant="light-purple">React JS</Tag>
                        <Tag variant="light-purple">TailwindCSS</Tag>
                        <Tag variant="light-purple">Typescript</Tag>
                        <Tag variant="peach">Golang</Tag>
                        <Tag variant="peach">ElasticSearch</Tag>
                        <Tag variant="peach">RabbitMQ</Tag>
                    </div>
                </div>
            </div>
            <div className={styles["exp-container"]}>
                <div className={styles["logo-container"]}>
                    <img
                        src="https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/logo/logo_shopback.png"
                        alt="hasaki.vn"
                        className={styles["logo"]}
                    />
                </div>
                <div className={styles["exp-detail"]}>
                    <div className={styles["exp-info"]}>
                        <div className={styles["exp-title"]}>
                            <span className="bold">FRONTEND ENGINEER</span>
                            <span className={styles["exp-time"]}>
                                09/2024 - 05/2025
                            </span>
                        </div>
                        <span>
                            Developed and maintained both e-commerce and
                            internal web applications, working closely with
                            cross-functional teams to deliver new features and
                            improve UI. Contributed to Core UI development,
                            migration to a monorepo, A/B testing, feature flags,
                            event tracking,...
                        </span>
                    </div>
                    <div className={styles.techstack}>
                        <Tag variant="light-purple">React JS</Tag>
                        <Tag variant="light-purple">Next.js</Tag>
                        <Tag variant="light-purple">Typescript</Tag>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkExperience
