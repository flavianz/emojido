import { NodeExit, NodeExpr, Token, TokenType } from "./types";

export class Parser {
    private index: number = 0;
    private readonly tokens: Token[];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    /** check the next token
     * @returns {Token | null} the token it's at or null
     * */
    private peek(count: number = 0): Token | null {
        return this.tokens[this.index + count] ?? null;
    }

    /** go to next token
     * @returns {Token} the used token
     * */
    private consume(): Token {
        return this.tokens[this.index++];
    }

    /** Parse the exit coming up from tokens to expr
     * @returns {NodeExpr | null} the created expr
     * */
    parse_expr(): NodeExpr | null {
        if (this.peek() && this.peek().type === TokenType.int_lit) {
            return { int_lit: this.consume() };
        } else {
            return null;
        }
    }

    /**Parse the tokens to an understandable parse tree
     * @returns {NodeExit | null} the root node of the parse tree
     * */
    parse(): NodeExit | null {
        let nodeExit: NodeExit;

        //loop over all tokens
        while (this.peek()) {
            if (this.peek().type == TokenType.exit) {
                this.consume();

                //parse the expr after the exit
                const expr = this.parse_expr();
                if (expr) {
                    nodeExit = { expr: expr };
                } else {
                    throw new Error("Invalid expression");
                }

                //missing semi
                if (this.peek() || this.peek().type === TokenType.semi) {
                    this.consume();
                } else {
                    throw new Error("Missing ';'");
                }
            }
        }
        this.index = 0;
        return nodeExit;
    }
}
