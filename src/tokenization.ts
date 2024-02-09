import { Token, TokenType } from "./types.js";

export function getBinaryPrecedence(type: TokenType) {
    switch (type) {
        case TokenType.pow:
            return 2;
        case TokenType.star:
        case TokenType.slash:
            return 1;
        case TokenType.plus:
        case TokenType.minus:
            return 0;
        default:
            return null;
    }
}

/**Check if string is alphanumeric
 * @param {string} str the char
 * @returns {boolean} true if provided string is alphanumeric
 * */
function isAlphanumeric(str: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(str);
}
/**Check if string is numeric
 * @param {string} str the char
 * @returns {boolean} true if provided string is numeric
 * */
function isNumeric(str: string): boolean {
    return /^\d+$/.test(str);
}
/**Check if string is alphabetic
 * @param {string} str the char
 * @returns {boolean} true if provided string is alphabetic
 * */
function isAlphabetic(str: string): boolean {
    return /[a-z]/i.test(str);
}

export class Tokenizer {
    private readonly source: string;
    private index: number = 0;
    constructor(source: string) {
        this.source = source;
    }

    /** check the next char
     * @returns {string | null} the char it's at or null
     * */
    private peek(count: number = 0): string | null {
        return this.source[this.index + count] ?? null;
    }

    /** go to next char
     * @returns {string} the used char
     * */
    private consume(): string {
        return this.source[this.index++];
    }

    /** Turn the source into meaningful tokens
     * @returns {Token[]} the tokens
     * */
    tokenize(): Token[] {
        let tokens: Token[] = [];
        let buffer: string = "";

        //loop over every char of source
        while (this.peek()) {
            //identifier or keyword
            if (isAlphabetic(this.peek())) {
                buffer += this.consume();

                // only the first char of identifier or keyword can't be numeric
                while (isAlphanumeric(this.peek() ?? null)) {
                    buffer += this.consume();
                }

                //check keywords
                if (buffer === "exit") {
                    tokens.push({ type: TokenType.exit });
                    buffer = "";
                } else if (buffer === "let") {
                    tokens.push({ type: TokenType.let });
                    buffer = "";
                } else if (buffer === "if") {
                    tokens.push({ type: TokenType.if });
                    buffer = "";
                } else if (buffer === "elseif") {
                    tokens.push({ type: TokenType.elseif });
                    buffer = "";
                } else if (buffer === "else") {
                    tokens.push({ type: TokenType.else });
                    buffer = "";
                } else {
                    //identifier
                    tokens.push({ type: TokenType.ident, value: buffer });
                    buffer = "";
                }
            }
            //number
            else if (isNumeric(this.peek())) {
                buffer += this.consume();

                //get entire number
                while (isNumeric(this.peek() ?? null)) {
                    buffer += this.consume();
                }

                tokens.push({ type: TokenType.int_lit, value: buffer });
                buffer = "";
            } else if (this.peek() === ";") {
                tokens.push({ type: TokenType.semi });
                this.consume();
            } else if (this.peek() === "(") {
                tokens.push({ type: TokenType.open_paren });
                this.consume();
            } else if (this.peek() === "=") {
                tokens.push({ type: TokenType.equals });
                this.consume();
            } else if (this.peek() === ")") {
                tokens.push({ type: TokenType.close_paren });
                this.consume();
            } else if (this.peek() === "{") {
                tokens.push({ type: TokenType.open_curly });
                this.consume();
            } else if (this.peek() === "}") {
                tokens.push({ type: TokenType.close_curly });
                this.consume();
            } else if (this.peek() === "+") {
                tokens.push({ type: TokenType.plus });
                this.consume();
            } else if (this.peek() === "-") {
                tokens.push({ type: TokenType.minus });
                this.consume();
            } else if (this.peek() === "/") {
                this.consume();
                if (this.peek() === "/") {
                    this.consume();
                    while (this.peek() !== "\n" && this.peek()) {
                        this.consume();
                    }
                    this.consume();
                } else if (this.peek() === "$") {
                    this.consume();
                    while (
                        !(this.peek() === "/" && this.peek(1) === "$") &&
                        this.peek()
                    ) {
                        this.consume();
                    }
                    this.consume();
                    this.consume();
                } else {
                    tokens.push({ type: TokenType.slash });
                }
            } else if (this.peek() === "*") {
                if (this.peek(1) === "*") {
                    tokens.push({ type: TokenType.pow });
                    this.consume();
                    this.consume();
                } else {
                    tokens.push({ type: TokenType.star });
                    this.consume();
                }
            }
            //whitespace
            else if (
                [" ", "\f", "\n", "\r", "\t", "\v"].includes(this.peek())
            ) {
                this.consume();
            } else {
                throw new Error();
            }
        }
        this.index = 0;
        return tokens;
    }
}
