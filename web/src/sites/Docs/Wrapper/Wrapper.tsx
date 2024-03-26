import { MDXProvider } from "@mdx-js/react";
import styles from "./Wrapper.module.css";

export default function Wrapper({ doc }) {
    const nav = [
        {
            name: "Getting Started",
            link: "/#/docs/getting-started",
            children: [
                {
                    name: "Introduction",
                    link: "/#/docs/intro",
                },
                {
                    name: "Introduction",
                    link: "/#/docs/intro",
                },
                {
                    name: "Introduction",
                    link: "/#/docs/intro",
                },
            ],
        },
        {
            name: "Getting Started",
            link: "/#/docs/getting-started",
            children: [
                {
                    name: "Introduction",
                    link: "/#/docs/intro",
                },
                {
                    name: "Introduction",
                    link: "/#/docs/intro",
                },
                {
                    name: "Introduction",
                    link: "/#/docs/intro",
                },
            ],
        },
    ];
    return (
        <MDXProvider>
            <div className={styles.container}>
                <div className={styles.headerContainer}>
                    <h1 className={styles.title}>Emojido 📖</h1>
                </div>
                <div className={styles.contentContainer}>
                    <div className={styles.navbarContainer}>
                        {nav.map((sections, key) => {
                            return (
                                <div key={key} className={styles.navbarSection}>
                                    <a
                                        href={sections.link}
                                        className={styles.navbarSectionHeader}
                                    >
                                        {sections.name}
                                    </a>
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
