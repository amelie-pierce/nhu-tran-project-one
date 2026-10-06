import { useRef, useState, useEffect } from "react"
import styles from "./TextOverflow.module.css"

const TextOverflow = ({
    text,
    className,
}: {
    text: string
    className?: string
}) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [showExpand, setShowExpand] = useState(false)

    const textRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (textRef.current) {
            const viewHeight = textRef.current?.clientHeight || 0
            const actualHeight = textRef.current?.scrollHeight || 0
            setShowExpand(actualHeight > viewHeight)
        }
    }, [text])

    return (
        <div className={styles.wrapper}>
            <div
                ref={textRef}
                className={`${className || ""} ${styles.container} 
                ${isExpanded ? styles.expanded : ""}`}
            >
                {text}
            </div>

            {showExpand && (
                <div
                    className={styles.toggle}
                    onClick={() => setIsExpanded((prev) => !prev)}
                >
                    {isExpanded ? "See less" : "See more"}
                </div>
            )}
        </div>
    )
}

export default TextOverflow
