import { Tag } from "@/components/ui"
import styles from "./Introduction.module.css"
import { transformImage } from "@/utils/transformImage"
import { getImgSizeWidth } from "@/utils/getImgSizeWidth"

const Introduction = () => {
    const introImage =
        "https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/assets/about.png"
    return (
        <div className={`page-padding ${styles["wrapper"]}`}>
            <div className={styles.intro}>
                <div className={styles["intro-text"]}>
                    <span className="heading bold">Hi, I'm Nhu</span>
                    <span className="heading bold">
                        I’m a Frontend Engineer
                    </span>
                    <span>
                        Just a curious person who enjoys learning new things,
                        exploring ideas, and growing through every experience.
                    </span>
                </div>
                <div className={styles["hobbies"]}>
                    <Tag variant="light-purple">Listening to music</Tag>
                    <Tag variant="light-purple">Swimming</Tag>
                </div>
            </div>
            <img
                src={introImage}
                srcSet={`
                    ${transformImage(introImage, 200)} 200w,
                    ${transformImage(introImage, 350)} 350w,
                    ${transformImage(introImage, 500)} 500w,
                    ${transformImage(introImage, 800)} 800w,
                `}
                sizes={getImgSizeWidth(200, 350, 500, 800)}
                alt="about me"
                className={styles["intro-img"]}
                fetchPriority="high"
            />
        </div>
    )
}

export default Introduction
