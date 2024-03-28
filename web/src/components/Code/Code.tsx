import styles from "./Code.module.css";
import { useState } from "react";

export default function Code({ children, inline, toCopy }) {
    // for(children.)
    const [copied, setCopied] = useState("Copy!");
    return inline ? (
        <span className={styles.inline}>{children}</span>
    ) : (
        <p className={styles.block}>
            {children}
            <span
                className={styles.copy}
                onClick={async () => {
                    await navigator.clipboard.writeText(toCopy);
                    setCopied("Copied!");
                }}
            >
                {copied}
            </span>
        </p>
    );
}
