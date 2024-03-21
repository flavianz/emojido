import { LineCount, Token, TokenType } from "./types";

export function getBinaryPrecedence(type: TokenType) {
    switch (type) {
        case TokenType.star:
        case TokenType.slash:
            return 4;
        case TokenType.plus:
        case TokenType.minus:
            return 3;
        case TokenType.double_equals:
        case TokenType.not_equals:
            return 2;
        case TokenType.smaller:
        case TokenType.smallerEquals:
        case TokenType.greater:
        case TokenType.greaterEquals:
            return 1;
        case TokenType.and:
        case TokenType.or:
        case TokenType.xor:
            return 0;
        default:
            return null;
    }
}

export function error(error: string, line: LineCount) {
    throw new Error(
        `[Parse 💥]: ${error} on line ${line?.line} in file ${line?.file}`,
    );
}

/**Check if string is alphanumeric
 * @param {string} str the char
 * @returns {boolean} true if provided string is alphanumeric
 * */
function isAlphanumeric(str: string): boolean {
    return str ? /^[a-zA-Z0-9]+$/.test(str) : false;
}
/**Check if string is numeric
 * @param {string} str the char
 * @returns {boolean} true if provided string is numeric
 * */
function isNumeric(str: string): boolean {
    return str ? /^[\d-.]+$/.test(str) : false;
}
/**Check if string is alphabetic
 * @param {string} str the char
 * @returns {boolean} true if provided string is alphabetic
 * */
function isAlphabetic(str: string): boolean {
    return str ? /[a-z]/i.test(str) : false;
}

export class Tokenizer {
    private readonly source: string;
    private index: number = 0;
    private lineCount: number = 1;
    private file: string;
    constructor(source: string, file: string) {
        this.source = source;
        this.file = file;
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
                    tokens.push({
                        type: TokenType.exit,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "let") {
                    tokens.push({
                        type: TokenType.let,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "if") {
                    tokens.push({
                        type: TokenType.if,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "elseif") {
                    tokens.push({
                        type: TokenType.elseif,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "else") {
                    tokens.push({
                        type: TokenType.else,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "true") {
                    tokens.push({
                        type: TokenType.boolean_lit,
                        line: { line: this.lineCount, file: this.file },
                        value: "1",
                    });
                    buffer = "";
                } else if (buffer === "false") {
                    tokens.push({
                        type: TokenType.boolean_lit,
                        line: { line: this.lineCount, file: this.file },
                        value: "0",
                    });
                    buffer = "";
                } else if (buffer === "bool") {
                    tokens.push({
                        type: TokenType.typeBool,
                        line: { line: this.lineCount, file: this.file },
                        value: "bool",
                    });
                    buffer = "";
                } else if (buffer === "int") {
                    tokens.push({
                        type: TokenType.typeInt,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "print") {
                    tokens.push({
                        type: TokenType.print,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "minus") {
                    tokens.push({
                        type: TokenType.minus,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "minusminus") {
                    tokens.push({
                        type: TokenType.doubleMinus,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "int") {
                    tokens.push({
                        type: TokenType.typeInt,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "float") {
                    tokens.push({
                        type: TokenType.typeFloat,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "bool") {
                    tokens.push({
                        type: TokenType.typeBool,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "function") {
                    tokens.push({
                        type: TokenType.function,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "call") {
                    tokens.push({
                        type: TokenType.callFunction,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "string") {
                    tokens.push({
                        type: TokenType.typeString,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "return") {
                    tokens.push({
                        type: TokenType.return,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "null") {
                    tokens.push({
                        type: TokenType.null,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "minusequal") {
                    tokens.push({
                        type: TokenType.minusEqual,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "while") {
                    tokens.push({
                        type: TokenType.while,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "for") {
                    tokens.push({
                        type: TokenType.for,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "import") {
                    tokens.push({
                        type: TokenType.import,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "asm") {
                    tokens.push({
                        type: TokenType.assembly,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "pointer") {
                    tokens.push({
                        type: TokenType.typeInt,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else if (buffer === "obj") {
                    tokens.push({
                        type: TokenType.object,
                        line: { line: this.lineCount, file: this.file },
                    });
                    buffer = "";
                } else {
                    //identifier
                    tokens.push({
                        type: TokenType.ident,
                        value: buffer,
                        line: { line: this.lineCount, file: this.file },
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
                    type: buffer.includes(".")
                        ? TokenType.float
                        : TokenType.int_lit,
                    value: buffer,
                    line: { line: this.lineCount, file: this.file },
                });
                buffer = "";
            } else if (this.peek() === ";") {
                tokens.push({
                    type: TokenType.semi,
                    line: { line: this.lineCount, file: this.file },
                });
                this.consume();
            } else if (this.peek() === "[") {
                tokens.push({
                    type: TokenType.openBracket,
                    line: { line: this.lineCount, file: this.file },
                });
                this.consume();
            } else if (this.peek() === "]") {
                tokens.push({
                    type: TokenType.closeBracket,
                    line: { line: this.lineCount, file: this.file },
                });
                this.consume();
            } else if (this.peek() === "(") {
                tokens.push({
                    type: TokenType.open_paren,
                    line: { line: this.lineCount, file: this.file },
                });
                this.consume();
            } else if (this.peek() === "=") {
                this.consume();
                if (this.peek() === "=") {
                    tokens.push({
                        type: TokenType.double_equals,
                        line: { line: this.lineCount, file: this.file },
                    });
                    this.consume();
                } else {
                    tokens.push({
                        type: TokenType.equals,
                        line: { line: this.lineCount, file: this.file },
                    });
                }
            } else if (this.peek() === ")") {
                tokens.push({
                    type: TokenType.close_paren,
                    line: { line: this.lineCount, file: this.file },
                });
                this.consume();
            } else if (this.peek() === "{") {
                tokens.push({
                    type: TokenType.open_curly,
                    line: { line: this.lineCount, file: this.file },
                });
                this.consume();
            } else if (this.peek() === "}") {
                tokens.push({
                    type: TokenType.close_curly,
                    line: { line: this.lineCount, file: this.file },
                });
                this.consume();
            } else if (this.peek() === "+") {
                this.consume();
                if (this.peek() === "=") {
                    this.consume();
                    tokens.push({
                        type: TokenType.plusEqual,
                        line: { line: this.lineCount, file: this.file },
                    });
                } else if (this.peek() === "+") {
                    this.consume();
                    tokens.push({
                        type: TokenType.doublePlus,
                        line: { line: this.lineCount, file: this.file },
                    });
                } else {
                    tokens.push({
                        type: TokenType.plus,
                        line: { line: this.lineCount, file: this.file },
                    });
                }
            } else if (this.peek() === "-") {
                tokens.push({
                    type: TokenType.minus,
                    line: { line: this.lineCount, file: this.file },
                });
            } else if (this.peek() === "/") {
                this.consume();
                if (this.peek() === "/") {
                    this.consume();
                    while (this.peek() !== "\n" && this.peek()) {
                        this.consume();
                    }
                    this.consume();
                    this.lineCount++;
                } else if (this.peek() === "$") {
                    this.consume();
                    while (
                        !(this.peek() === "/" && this.peek(1) === "$") &&
                        this.peek()
                    ) {
                        const char = this.consume();
                        if (char === "\n") {
                            this.lineCount++;
                        }
                    }
                    this.consume();
                    this.consume();
                } else if (this.peek() === "=") {
                    this.consume();
                    tokens.push({
                        type: TokenType.minusEqual,
                        line: { line: this.lineCount, file: this.file },
                    });
                } else {
                    tokens.push({
                        type: TokenType.slash,
                        line: { line: this.lineCount, file: this.file },
                    });
                }
            } else if (this.peek() === "*") {
                this.consume();
                if (this.peek() === "=") {
                    this.consume();
                    tokens.push({
                        type: TokenType.mulEqual,
                        line: { line: this.lineCount, file: this.file },
                    });
                } else {
                    tokens.push({
                        type: TokenType.star,
                        line: { line: this.lineCount, file: this.file },
                    });
                }
            } else if (this.peek() === "!") {
                this.consume();
                if (this.peek() === "=") {
                    this.consume();
                    tokens.push({
                        type: TokenType.not_equals,
                        line: { line: this.lineCount, file: this.file },
                    });
                } else if (this.peek() === "|") {
                    this.consume();
                    tokens.push({
                        type: TokenType.xor,
                        line: { line: this.lineCount, file: this.file },
                    });
                } else {
                    tokens.push({
                        type: TokenType.exclamation,
                        line: { line: this.lineCount, file: this.file },
                    });
                }
            } else if (this.peek() === "|" && this.peek(1) === "|") {
                this.consume();
                this.consume();
                tokens.push({
                    type: TokenType.or,
                    line: { line: this.lineCount, file: this.file },
                });
            } else if (this.peek() === "&" && this.peek(1) === "&") {
                this.consume();
                this.consume();
                tokens.push({
                    type: TokenType.and,
                    line: { line: this.lineCount, file: this.file },
                });
            } else if (this.peek() === '"') {
                this.consume();
                tokens.push({
                    type: TokenType.quotes,
                    line: { line: this.lineCount, file: this.file },
                });
                while (this.peek() !== '"' && this.peek()) {
                    let char = this.consume();
                    buffer += char;
                    if (char === "\n") {
                        this.lineCount++;
                    }
                }
                this.consume();
                tokens.push({
                    type: TokenType.string,
                    line: { line: this.lineCount, file: this.file },
                    value: buffer,
                });
                tokens.push({
                    type: TokenType.quotes,
                    line: { line: this.lineCount, file: this.file },
                });
                buffer = "";
            } else if (this.peek() === "<") {
                this.consume();
                if (this.peek() === "=") {
                    this.consume();
                    tokens.push({
                        type: TokenType.smallerEquals,
                        line: { line: this.lineCount, file: this.file },
                    });
                } else {
                    tokens.push({
                        type: TokenType.smaller,
                        line: { line: this.lineCount, file: this.file },
                    });
                }
            } else if (this.peek() === ">") {
                this.consume();
                if (this.peek() === "=") {
                    this.consume();
                    tokens.push({
                        type: TokenType.greaterEquals,
                        line: { line: this.lineCount, file: this.file },
                    });
                } else {
                    tokens.push({
                        type: TokenType.greater,
                        line: { line: this.lineCount, file: this.file },
                    });
                }
            } else if (this.peek() === ",") {
                this.consume();
                tokens.push({
                    type: TokenType.comma,
                    line: { line: this.lineCount, file: this.file },
                });
            } else if (this.peek() === "\n") {
                this.consume();
                this.lineCount++;
            }
            //whitespace
            else if ([" ", "\f", "\r", "\t", "\v"].includes(this.peek())) {
                this.consume();
            } else {
                error("Invalid token", {
                    line: this.lineCount,
                    file: this.file,
                });
            }
        }
        this.index = 0;
        return tokens;
    }
}
