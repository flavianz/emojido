import {
    AssemblyAddToken,
    AssemblyCommentToken,
    AssemblyDivToken,
    AssemblyMovToken,
    AssemblyMulToken,
    AssemblyPopToken,
    AssemblyPushToken,
    AssemblySubToken,
    AssemblyToken,
    AssemblyUnoptimizedToken,
} from "./classes/AssemblyTokens";

export class Optimizer {
    index: number = 0;
    source: AssemblyToken[];
    optimized: AssemblyToken[] = [];
    constructor(source: AssemblyToken[]) {
        this.source = source;
    }

    optimize(): AssemblyToken[] {
        let i = 0;
        while (i < 20) {
            i++;
            while (this.peek()) {
                const token = this.consume();
                if (token instanceof AssemblyPushToken) {
                    if (this.peek() instanceof AssemblyPopToken) {
                        const pop = this.consume() as AssemblyPopToken;
                        this.optimized.push(
                            new AssemblyMovToken(
                                pop.register,
                                token.expression,
                            ),
                        );
                    } else {
                        this.optimized.push(token.clearComment());
                    }
                } else if (token instanceof AssemblyPopToken) {
                    if (this.peek() instanceof AssemblyPushToken) {
                        const push = this.peek() as AssemblyPushToken;
                        if (push.expression === token.register) {
                            this.consume();
                            this.optimized.push(
                                new AssemblyMovToken(
                                    token.register,
                                    push.expression,
                                ),
                            );
                        } else {
                            this.optimized.push(token.clearComment());
                        }
                    } else {
                        this.optimized.push(token.clearComment());
                    }
                } else if (token instanceof AssemblyMovToken) {
                    if (token.expression !== token.register) {
                        this.optimized.push(token.clearComment());
                    }
                } else if (token instanceof AssemblyAddToken) {
                    if (token.expression !== "0") {
                        const next = this.peek();
                        if (next instanceof AssemblySubToken) {
                            if (
                                next.register === token.register &&
                                next.expression === token.expression
                            ) {
                                this.consume();
                            } else {
                                this.optimized.push(token.clearComment());
                            }
                        } else {
                            this.optimized.push(token.clearComment());
                        }
                    }
                } else if (token instanceof AssemblySubToken) {
                    if (token.expression !== "0") {
                        const next = this.peek();
                        if (next instanceof AssemblyAddToken) {
                            if (
                                next.register === token.register &&
                                next.expression === token.expression
                            ) {
                                this.consume();
                            } else {
                                this.optimized.push(token.clearComment());
                            }
                        } else {
                            this.optimized.push(token.clearComment());
                        }
                    }
                } else if (token instanceof AssemblyMulToken) {
                    if (token.expression !== "1") {
                        const next = this.peek();
                        if (next instanceof AssemblyDivToken) {
                            if (next.expression === token.expression) {
                                this.consume();
                            } else {
                                this.optimized.push(token.clearComment());
                            }
                        } else {
                            this.optimized.push(token.clearComment());
                        }
                    }
                } else if (token instanceof AssemblyDivToken) {
                    if (token.expression !== "1") {
                        const next = this.peek();
                        if (next instanceof AssemblyMulToken) {
                            if (next.expression === token.expression) {
                                this.consume();
                            } else {
                                this.optimized.push(token.clearComment());
                            }
                        } else {
                            this.optimized.push(token.clearComment());
                        }
                    }
                } else if (token instanceof AssemblyCommentToken) {
                    //delete
                } else {
                    this.optimized.push(token.clearComment());
                }
            }
            if (this.source === this.optimized) {
                break;
            }
            this.source = this.optimized;
            this.optimized = [];
            this.index = 0;
        }
        return this.source;
    }

    private peek(count: number = 0): AssemblyToken | null {
        return this.source[this.index + count] ?? null;
    }

    private consume(): AssemblyToken {
        return this.source[this.index++];
    }
}

function getComment(comment: string) {
    return comment === "" ? "" : " ; " + comment;
}

export function assemblify(source: AssemblyToken[]) {
    let text = "";
    for (const token of source) {
        if (token instanceof AssemblyPushToken) {
            text += `    push ${token.expression}`;
        } else if (token instanceof AssemblyPopToken) {
            text += `    pop ${token.register}`;
        } else if (token instanceof AssemblyMovToken) {
            text += `    mov ${token.register}, ${token.expression}`;
        } else if (token instanceof AssemblyUnoptimizedToken) {
            text += token.string;
        } else if (token instanceof AssemblyAddToken) {
            text += `    add ${token.register}, ${token.expression}`;
        } else if (token instanceof AssemblySubToken) {
            text += `    sub ${token.register}, ${token.expression}`;
        } else if (token instanceof AssemblyMulToken) {
            text += `    mul ${token.expression}`;
        } else if (token instanceof AssemblyDivToken) {
            text += `    div ${token.expression}`;
        } else if (token instanceof AssemblyCommentToken) {
            text += "    ";
        }
        text += getComment(token.comment) + "\n";
    }

    return text;
}
