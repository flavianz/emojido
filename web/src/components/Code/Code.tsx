import styles from "./Code.module.css";
import { useState } from "react";

export default function Code({ children, inline, toCopy }) {
    const [copied, setCopied] = useState("Copy!");
    return inline ? (
        <span className={styles.inline}>{children}</span>
    ) : (
        <p className={styles.block}>
            {children}
            <span
                className={styles.copy}
                onClick={() => {
                    navigator.clipboard
                        .writeText(toCopy)
                        .then(() => setCopied("Copied!"));
                }}
            >
                {copied}
            </span>
        </p>
    );
}
