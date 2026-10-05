import styles from "./MainPoint.module.css"

type Props = {
    point: string
    desc: string
}

const MainPoint = ({ point, desc }: Props) => {
    return (
        <div className={styles.wrapper}>
            <div className={`${styles["main-point"]} bold`}>{point}</div>
            <div className={`${styles.desc} bold`}>{desc}</div>
        </div>
    )
}

export default MainPoint
