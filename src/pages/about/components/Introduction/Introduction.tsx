import Tag from "../../../../components/ui/Tag/Tag"
import styles from "./Introduction.module.css"

const Introduction = () => {
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
                src="https://xqmtkyrrnebwmziqprii.supabase.co/storage/v1/object/public/assets/about.png"
                alt="about me"
                className={styles["intro-img"]}
            />
        </div>
    )
}

export default Introduction
