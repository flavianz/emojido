import { Token, TokenType } from "./types.js";

export function getBinaryPrecedence(type: TokenType) {
    switch (type) {
        case TokenType.pow:
            return 4;
        case TokenType.star:
        case TokenType.slash:
            return 3;
        case TokenType.plus:
        case TokenType.minus:
            return 2;
        case TokenType.double_equals:
        case TokenType.not_equals:
            return 1;
        case TokenType.and:
        case TokenType.or:
        case TokenType.xor:
        case TokenType.smaller:
        case TokenType.smallerEquals:
        case TokenType.greater:
        case TokenType.greaterEquals:
            return 0;
        default:
            return null;
    }
}

export function isBoolBinaryOperator(type: TokenType) {
    return (
        type === TokenType.and ||
        type === TokenType.or ||
        type === TokenType.xor
    );
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
    return /^[\d-]+$/.test(str);
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
    private lineCount: number = 1;
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

    private error(error: string, line: number) {
        throw new Error(`[Parse Error]: ${error} on line ${line}`);
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
                    tokens.push({ type: TokenType.exit, line: this.lineCount });
                    buffer = "";
                } else if (buffer === "let") {
                    tokens.push({ type: TokenType.let, line: this.lineCount });
                    buffer = "";
                } else if (buffer === "if") {
                    tokens.push({ type: TokenType.if, line: this.lineCount });
                    buffer = "";
                } else if (buffer === "elseif") {
                    tokens.push({
                        type: TokenType.elseif,
                        line: this.lineCount,
                    });
                    buffer = "";
                } else if (buffer === "else") {
                    tokens.push({ type: TokenType.else, line: this.lineCount });
                    buffer = "";
                } else if (buffer === "true") {
                    tokens.push({
                        type: TokenType.boolean_lit,
                        line: this.lineCount,
                        value: "1",
                    });
                    buffer = "";
                } else if (buffer === "false") {
                    tokens.push({
                        type: TokenType.boolean_lit,
                        line: this.lineCount,
                        value: "0",
                    });
                    buffer = "";
                } else if (buffer === "bool") {
                    tokens.push({
                        type: TokenType.type,
                        line: this.lineCount,
                        value: "bool",
                    });
                    buffer = "";
                } else if (buffer === "int") {
                    tokens.push({
                        type: TokenType.type,
                        line: this.lineCount,
                        value: "int",
                    });
                    buffer = "";
                } else if (buffer === "print") {
                    tokens.push({
                        type: TokenType.print,
                        line: this.lineCount,
                    });
                    buffer = "";
                } else {
                    //identifier
                    tokens.push({
                        type: TokenType.ident,
                        value: buffer,
                        line: this.lineCount,
                    });
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

                tokens.push({
                    type: TokenType.int_lit,
                    value: buffer,
                    line: this.lineCount,
                });
                buffer = "";
            } else if (this.peek() === ";") {
                tokens.push({ type: TokenType.semi, line: this.lineCount });
                this.consume();
            } else if (this.peek() === "(") {
                tokens.push({
                    type: TokenType.open_paren,
                    line: this.lineCount,
                });
                this.consume();
            } else if (this.peek() === "=") {
                this.consume();
                if (this.peek() === "=") {
                    tokens.push({
                        type: TokenType.double_equals,
                        line: this.lineCount,
                    });
                    this.consume();
                } else {
                    tokens.push({
                        type: TokenType.equals,
                        line: this.lineCount,
                    });
                }
            } else if (this.peek() === ")") {
                tokens.push({
                    type: TokenType.close_paren,
                    line: this.lineCount,
                });
                this.consume();
            } else if (this.peek() === "{") {
                tokens.push({
                    type: TokenType.open_curly,
                    line: this.lineCount,
                });
                this.consume();
            } else if (this.peek() === "}") {
                tokens.push({
                    type: TokenType.close_curly,
                    line: this.lineCount,
                });
                this.consume();
            } else if (this.peek() === "+") {
                tokens.push({ type: TokenType.plus, line: this.lineCount });
                this.consume();
            } else if (this.peek() === "-") {
                tokens.push({ type: TokenType.minus, line: this.lineCount });
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
                    tokens.push({
                        type: TokenType.slash,
                        line: this.lineCount,
                    });
                }
            } else if (this.peek() === "*") {
                if (this.peek(1) === "*") {
                    tokens.push({ type: TokenType.pow, line: this.lineCount });
                    this.consume();
                    this.consume();
                } else {
                    tokens.push({ type: TokenType.star, line: this.lineCount });
                    this.consume();
                }
            } else if (this.peek() === "!") {
                this.consume();
                if (this.peek() === "=") {
                    this.consume();
                    tokens.push({
                        type: TokenType.not_equals,
                        line: this.lineCount,
                    });
                } else if (this.peek() === "|") {
                    this.consume();
                    tokens.push({ type: TokenType.xor, line: this.lineCount });
                } else {
                    // !
                }
            } else if (this.peek() === "|" && this.peek(1) === "|") {
                this.consume();
                this.consume();
                tokens.push({ type: TokenType.or, line: this.lineCount });
            } else if (this.peek() === "&" && this.peek(1) === "&") {
                this.consume();
                this.consume();
                tokens.push({ type: TokenType.and, line: this.lineCount });
            } else if (this.peek() === '"') {
                this.consume();
                tokens.push({ type: TokenType.quotes, line: this.lineCount });
                while (this.peek() !== '"' && this.peek()) {
                    buffer += this.consume();
                }
                this.consume();
                tokens.push({
                    type: TokenType.string,
                    line: this.lineCount,
                    value: buffer,
                });
                tokens.push({ type: TokenType.quotes, line: this.lineCount });
                buffer = "";
            } else if (this.peek() === "<") {
                this.consume();
                if (this.peek() === "=") {
                    this.consume();
                    tokens.push({
                        type: TokenType.smallerEquals,
                        line: this.lineCount,
                    });
                } else {
                    tokens.push({
                        type: TokenType.smaller,
                        line: this.lineCount,
                    });
                }
            } else if (this.peek() === ">") {
                this.consume();
                if (this.peek() === "=") {
                    this.consume();
                    tokens.push({
                        type: TokenType.greaterEquals,
                        line: this.lineCount,
                    });
                } else {
                    tokens.push({
                        type: TokenType.greater,
                        line: this.lineCount,
                    });
                }
            } else if (this.peek() === "\n") {
                this.consume();
                this.lineCount++;
            }
            //whitespace
            else if ([" ", "\f", "\r", "\t", "\v"].includes(this.peek())) {
                this.consume();
            } else {
                this.error("Invalid token", this.lineCount);
            }
        }
        this.index = 0;
        return tokens;
    }
}
