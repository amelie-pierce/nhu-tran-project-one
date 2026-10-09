import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { Button, Tag } from "@/components/ui"
import { transformImage } from "@/utils/transformImage"
import styles from "./Project.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook } from "@fortawesome/free-solid-svg-icons"
import { useScreenWidth } from "@/hooks/useScreenWidth"
import { getImgSizeWidth } from "@/utils/getImgSizeWidth"

const Project = () => {
    const screenWidth = useScreenWidth()

    const overlappingMobile =
        "https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/assets/overlapping%202.png"
    const overlappingDesktop =
        "https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/assets/overlapping%201.png"
    const yoloImage =
        "https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/assets/yolo.png"

    return (
        <div className={`page-padding ${styles.wrapper}`}>
            <div className="heading bold">2 Research Projects</div>
            <div className={styles["project-container"]}>
                <div className={styles.project}>
                    <img
                        src={
                            screenWidth <= 480
                                ? overlappingMobile
                                : overlappingDesktop
                        }
                        srcSet={`
                            ${transformImage(overlappingMobile, 300)} 300w,
                            ${transformImage(overlappingDesktop, 500)} 500w,
                            ${transformImage(overlappingDesktop, 600)} 600w,
                            ${transformImage(overlappingDesktop, 1000)} 1000w,
                        `}
                        sizes={getImgSizeWidth(300, 600, 500, 1000)}
                        alt="project img"
                        className={styles["project-img"]}
                    />
                    <div className={styles["project-info"]}>
                        <div className={styles["project-desc"]}>
                            <div className={styles["tag-container"]}>
                                <Tag variant="light-purple">K-Means</Tag>
                                <Tag variant="light-purple">
                                    Data Clustering
                                </Tag>
                                <Tag variant="light-purple">
                                    Machine Learning
                                </Tag>
                            </div>
                            <div className="bold">
                                OVERLAPPING CLUSTERING MODEL BASED ON K-MEANS
                                ALGORITHM
                            </div>
                            <div>
                                An improved K-Means model to group data points
                                that belong to multiple groups at the same time.
                            </div>
                        </div>
                        <div className={styles["button-container"]}>
                            <Button
                                variant="secondary"
                                icon={<FontAwesomeIcon icon={faGithub} />}
                                className={styles.button}
                                onClick={() => {
                                    window.open(
                                        "https://github.com/tntn245/Extended_MCOKE_PySpark"
                                    )
                                }}
                            >
                                Github
                            </Button>
                            <Button
                                icon={<FontAwesomeIcon icon={faBook} />}
                                className={styles.button}
                                onClick={() => {
                                    window.open(
                                        "https://drive.google.com/file/d/1op-FN8Xt2DxhgAGgazkonHqNfIxpfTdG/view?usp=sharing"
                                    )
                                }}
                            >
                                Read
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={styles.project}>
                    <img
                        src={yoloImage}
                        srcSet={`
                            ${transformImage(yoloImage, 300)} 300w,
                            ${transformImage(yoloImage, 500)} 500w,
                            ${transformImage(yoloImage, 600)} 600w,
                            ${transformImage(yoloImage, 1000)} 1000w,
                        `}
                        sizes={getImgSizeWidth(300, 600, 500, 1000)}
                        alt="project img"
                        className={styles["project-img"]}
                    />
                    <div className={styles["project-info"]}>
                        <div className={styles["project-desc"]}>
                            <div className={styles["tag-container"]}>
                                <Tag variant="light-purple">
                                    Computer Vision
                                </Tag>
                                <Tag variant="light-purple">YOLO</Tag>
                            </div>
                            <div className="bold">
                                JEWELRY DETECTION AND AUTOMATIC INVENTORY
                                COUNTING
                            </div>
                            <div>
                                A computer vision system that detects,
                                classifies, and automatically counts jewelry on
                                store counters in real time.
                            </div>
                        </div>
                        <div className={styles["button-container"]}>
                            <Button
                                variant="secondary"
                                icon={<FontAwesomeIcon icon={faGithub} />}
                                className={styles.button}
                                onClick={() => {
                                    window.open(
                                        "https://github.com/duonguwu/DetectionAppPNJ"
                                    )
                                }}
                            >
                                Github
                            </Button>
                            <Button
                                icon={<FontAwesomeIcon icon={faBook} />}
                                className={styles.button}
                                onClick={() => {
                                    window.open(
                                        "https://drive.google.com/file/d/1jQz5SVy8b_246M1_2Tw8bokRlALWPfih/view?usp=sharing"
                                    )
                                }}
                            >
                                Read
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Project
