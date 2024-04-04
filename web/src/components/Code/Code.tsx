import styles from "./Code.module.css";
import { useState } from "react";

export default function Code({ children, inline, toCopy }) {
    const [copied, setCopied] = useState("Copy!");
    console.log(children);
    return inline ? (
        <span className={styles.inline}>{children}</span>
    ) : (
        <div className={styles.block}>
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
        </div>
    );
}
