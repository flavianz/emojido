import styles from "./Home.module.css";
import Header from "../../components/Header/Header.tsx";
import { useEffect, useState } from "react";

export default function Home() {
    const emojis = ["🖨️", "🔠", "👋", "🌍", "🔠", "🚀"];
    const [title, setTitle] = useState("");
    useEffect(() => {
        function timeout(delay: number) {
            return new Promise((res) => setTimeout(res, delay));
        }
        async function reveal() {
            let text = "";
            for (let i = 0; i < emojis.length; i++) {
                await timeout(100);
                setTitle(text + emojis[i]);
                text += emojis[i];
            }
        }
        reveal().catch();
    }, []);
    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>
                    ... is how you say hello in EmojiDo.
                </p>
                <div className={styles.actionsContainer}>
                    <a className={styles.action} href="/#/docs">
                        Learn more 📖
                    </a>
                    <a className={styles.action} href="/#/run">
                        Try online 🚀
                    </a>
                </div>
            </div>
        </div>
    );
}
