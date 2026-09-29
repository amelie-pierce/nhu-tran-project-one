import Button from "../Button";
import InputNumber from "../InputNumber";
import styles from "./Pagination.module.css";

const Pagination = () => {
    return (
        <div className={styles["pagination-container"]}>
            <div className={styles["pagination-go-to-page"]}>
                Go to page

                <InputNumber />

                <Button variant="border-black">
                    Go
                </Button>
            </div>

            <div className={styles["pagination-navigation"]}>
                <Button disabled>
                    {"<<"}
                </Button>

                <Button>
                    {"<"}
                </Button>

                <Button>
                    {">"}
                </Button>

                <Button>
                    {">>"}
                </Button>
            </div>
        </div>
    );
};

export default Pagination;