import styles from "./Loader.module.css"

const Loader = () => {
    return (
        <div className={styles["loading-wrapper"]}>
            <div className={styles.loader}></div>
        </div>
    )
}

export default Loader
