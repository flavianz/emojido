import styles from "./Error.module.css";

export default function Error() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404</h1>
            <div className={styles.divider}></div>
            <div className={styles.helpContainer}>
                <h2>Feeling lost?</h2>
                <a href="/#/docs">See the docs</a>
                <a href="/#/run">Run emojido online</a>
            </div>
        </div>
    );
}
