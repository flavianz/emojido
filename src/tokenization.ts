import { Token, TokenType } from "./types.js";

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
        while (this.peek() !== null) {
            //identifier or keyword
            if (isAlphabetic(this.peek())) {
                buffer += this.consume();

                // only the first char of identifier or keyword can't be numeric
                while (this.peek() && isAlphanumeric(this.peek())) {
                    buffer += this.consume();
                }

                //check keywords
                if (buffer === "exit") {
                    tokens.push({ type: TokenType.exit });
                    buffer = "";
                } else {
                    throw new Error();
                }
            }
            //number
            else if (isNumeric(this.peek())) {
                buffer += this.consume();

                //get entire number
                while (this.peek() && isNumeric(this.peek())) {
                    buffer += this.consume();
                }

                tokens.push({ type: TokenType.int_lit, value: buffer });
                buffer = "";
            } else if (this.peek() == ";") {
                tokens.push({ type: TokenType.semi });
                this.consume();
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
