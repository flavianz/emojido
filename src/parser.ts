import {
    NodeExpr,
    NodeProgram,
    NodeStatement,
    NodeStatementExit,
    NodeStatementLet,
    Token,
    TokenType,
} from "./types";

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

    /** Parse the next token(s) to a statement
     * @returns {NodeStatement | null} the create statement
     * */
    parse_statement(): NodeStatement | null {
        if (this.peek()?.type === TokenType.exit) {
            this.consume();
            let statementExit: NodeStatementExit;

            //get expr inside exit
            const expr = this.parse_expr();
            if (expr) {
                statementExit = { expr: expr, type: "exit" };
            } else {
                throw new Error("Invalid expression");
            }
            //missing semi
            if (this.peek()?.type === TokenType.semi) {
                this.consume();
            } else {
                throw new Error("Missing '🚀'");
            }

            return { variant: statementExit };
        }
        //case let statement
        else if (
            this.peek()?.type === TokenType.let &&
            this.peek(1)?.type === TokenType.ident &&
            this.peek(2)?.type === TokenType.equals
        ) {
            //let
            this.consume();

            const ident = this.consume();
            let statementLet: NodeStatementLet;
            //equals
            this.consume();

            //parse expression
            const expr = this.parse_expr();
            if (expr) {
                statementLet = { ident: ident, expr: expr, type: "let" };
            } else {
                throw new Error("Invalid expression");
            }

            //missing semi
            if (this.peek()?.type === TokenType.semi) {
                this.consume();
            } else {
                throw new Error("Expected '🚀'");
            }
            return { variant: statementLet };
        } else {
            return null;
        }
    }

    /** Parse the next token(s) to an expr
     * @returns {NodeExpr | null} the created expr
     * */
    parse_expr(): NodeExpr | null {
        if (this.peek()?.type === TokenType.int_lit) {
            return { variant: { intLit: this.consume(), type: "intLit" } };
        } else if (this.peek()?.type === TokenType.ident) {
            return { variant: { identifier: this.consume(), type: "ident" } };
        } else {
            return null;
        }
    }

    /**Parse the tokens to an understandable parse tree
     * @returns {NodeProgram | null} the root node of the parse tree
     * */
    parse_program(): NodeProgram | null {
        let program: NodeProgram = { statements: [] };
        while (this.peek()) {
            const statement = this.parse_statement();
            if (statement) {
                program.statements.push(statement);
            } else {
                throw new Error("Invalid statement");
            }
        }
        return program;
    }
}
