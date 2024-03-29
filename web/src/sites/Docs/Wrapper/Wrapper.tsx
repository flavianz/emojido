import { MDXProvider } from "@mdx-js/react";
import styles from "./Wrapper.module.css";

export default function Wrapper({ doc }) {
    const nav = [
        {
            name: "Getting Started",
            children: [
                {
                    name: "Introduction",
                    link: "/#/docs/",
                },
                {
                    name: "Hello, World!",
                    link: "/#/docs/hello-world",
                },
            ],
        },
        {
            name: "Common Concepts",
            children: [
                {
                    name: "Variables",
                    link: "/#/docs/variables",
                },
                {
                    name: "Conditionals",
                    link: "/#/docs/conditionals",
                },
                {
                    name: "Loops",
                    link: "/#/docs/loops",
                },
                {
                    name: "Comments",
                    link: "/#/docs/comments",
                },
            ],
        },
    ];
    return (
        <MDXProvider>
            <div className={styles.container}>
                <div className={styles.headerContainer}>
                    <h1 className={styles.title}>EmojiDo 📖</h1>
                </div>
                <div className={styles.contentContainer}>
                    <div className={styles.navbarContainer}>
                        {nav.map((sections, key) => {
                            return (
                                <div key={key} className={styles.navbarSection}>
                                    <p className={styles.navbarSectionHeader}>
                                        {sections.name}
                                    </p>
                                    <div className={styles.navbarLinkContainer}>
                                        {sections.children.map(
                                            (link, subkey) => {
                                                return (
                                                    <a
                                                        key={subkey}
                                                        className={
                                                            styles.navbarLink
                                                        }
                                                        href={link.link}
                                                    >
                                                        {link.name}
                                                    </a>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.mdxContainer}>{doc}</div>
                </div>
            </div>
        </MDXProvider>
    );
}
