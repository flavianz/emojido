import { MDXProvider } from "@mdx-js/react";
import styles from "./Wrapper.module.css";
import Header from "../../../components/Header/Header.tsx";

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
                    name: "Functions",
                    link: "/#/docs/functions",
                },
                {
                    name: "Comments",
                    link: "/#/docs/comments",
                },
                {
                    name: "Data Types",
                    link: "/#/docs/data-types",
                },
            ],
        },
        {
            name: "Low Level Features",
            children: [
                {
                    name: "Pointers",
                    link: "/#/docs/pointers",
                },
                {
                    name: "Memory Management",
                    link: "/#/docs/memory-management",
                },
            ],
        },
    ];
    return (
        <MDXProvider>
            <div className={styles.container}>
                <Header docs={true} />
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
                                            (link, subKey) => {
                                                return (
                                                    <a
                                                        key={subKey}
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
