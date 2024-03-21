import styles from "./Run.module.css";
import { useState } from "react";
import { run } from "../../compiler/run.ts";

export default function Run() {
    document.title = "EmojiDo | Online Compiler";
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <h1 className={styles.title}>Run emojido</h1>
                <button
                    className={styles.buttonRun}
                    onClick={async () => {
                        setLoading(true);
                        let result: {
                            standardErr: { text: string }[];
                            exitCode: number | string;
                            standardOut: { text: string }[];
                        };
                        try {
                            result = await run(input);
                            if (result.standardErr.length > 0) {
                                let str = "";
                                for (const item of result.standardErr) {
                                    str += item.text;
                                }
                                setOutput(
                                    str.replaceAll("\x00", "\n") +
                                        "\nExit Code: " +
                                        result.exitCode,
                                );
                            } else {
                                let str = "";
                                for (const item of result.standardOut) {
                                    str += item.text;
                                }
                                setOutput(
                                    str.replaceAll("\x00", "\n") +
                                        "\nExit Code: " +
                                        result.exitCode,
                                );
                            }
                            setLoading(false);
                        } catch (e) {
                            setOutput(e);
                            setLoading(false);
                        }
                    }}
                >
                    {loading ? <div className={styles.loader}></div> : "🚀"}
                </button>
            </div>
            <div className={styles.windows}>
                <div className={styles.fieldContainer}>
                    <h2>Code</h2>
                    <textarea
                        value={input}
                        className={styles.field}
                        onChange={(e) => setInput(e.target.value)}
                        spellCheck={false}
                    />
                </div>
                <div className={styles.fieldContainer}>
                    <h2>Output</h2>
                    <textarea
                        className={`${styles.field} ${styles.output}`}
                        spellCheck={false}
                        readOnly={true}
                        value={output}
                    />
                </div>
            </div>
        </div>
    );
}
