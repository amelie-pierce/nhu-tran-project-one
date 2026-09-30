import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import Button from "../Button"
import InputNumber from "../InputNumber"
import styles from "./Pagination.module.css"

type Props = {
    currentPage: number
    totalPage: number
    onPageChange: (page: number) => void
}

const ELLIPSIS = -1

const Pagination = ({ currentPage, totalPage, onPageChange }: Props) => {
    const [inputPage, setInputPage] = useState(currentPage)

    const isFirstPage = currentPage === 1
    const isLastPage = currentPage === totalPage
    const pages: number[] = []

    if (currentPage - 1 > 1) {
        pages.push(ELLIPSIS)
    }

    if (currentPage > 1) {
        pages.push(currentPage - 1)
    }

    pages.push(currentPage)

    if (currentPage < totalPage) {
        pages.push(currentPage + 1)
    }

    if (currentPage + 1 < totalPage) {
        pages.push(ELLIPSIS)
    }

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPage) {
            return
        }
        onPageChange(page)
        setInputPage(page)
    }

    const handlePrevious = () => {
        handlePageChange(currentPage - 1)
    }

    const handleNext = () => {
        handlePageChange(currentPage + 1)
    }

    const handleFirst = () => {
        handlePageChange(1)
    }

    const handleLast = () => {
        handlePageChange(totalPage)
    }

    const handleGoToPage = () => {
        handlePageChange(inputPage)
    }

    return (
        <div className={styles["pagination-container"]}>
            <div className={styles["pagination-go-to-page"]}>
                Go to page
                <InputNumber
                    value={inputPage}
                    max={totalPage}
                    onChange={setInputPage}
                />
                <Button variant="border-black" onClick={handleGoToPage}>
                    Go
                    <FontAwesomeIcon icon={faChevronRight} />
                </Button>
            </div>

            <div className={styles["pagination-navigation"]}>
                <Button
                    variant="border-black"
                    square
                    disabled={isFirstPage}
                    onClick={handleFirst}
                >
                    {"<<"}
                </Button>

                <Button
                    variant="border-black"
                    square
                    disabled={isFirstPage}
                    onClick={handlePrevious}
                >
                    {"<"}
                </Button>

                {pages.map((page, index) => {
                    if (page === ELLIPSIS) {
                        return (
                            <span key={`ellipsis-${index}`}>
                                <FontAwesomeIcon icon={faEllipsis} />
                            </span>
                        )
                    }

                    return (
                        <Button
                            key={page}
                            variant={
                                page === currentPage
                                    ? "primary"
                                    : "border-black"
                            }
                            square
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </Button>
                    )
                })}

                <Button
                    variant="border-black"
                    square
                    disabled={isLastPage}
                    onClick={handleNext}
                >
                    {">"}
                </Button>

                <Button
                    variant="border-black"
                    square
                    disabled={isLastPage}
                    onClick={handleLast}
                >
                    {">>"}
                </Button>
            </div>
        </div>
    )
}

export default Pagination
