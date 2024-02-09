import { Nodes, Token, TokenType } from "./types";
import { getBinaryPrecedence } from "./tokenization";

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

    /** Check the type of the current token and consume if it matches
     * @param {TokenType} type The required type
     * @param {string} error Error to throw if types don't match.
     * If the function should not throw an error, leave the error empty
     * @returns {}
     * */
    private tryConsume(type: TokenType, error: string = ""): Token | null {
        if (this.peek()?.type === type) {
            return this.consume();
        } else if (error === "") {
            return null;
        } else {
            throw new Error(error);
        }
    }

    /** go to next token
     * @returns {Token} the used token
     * */
    private consume(): Token {
        return this.tokens[this.index++];
    }

    /** Parse the term coming up in tokens
     * @returns {Nodes.Term | null} the parsed term
     * */
    private parseTerm(): Nodes.Term | null {
        const token = this.consume();
        if (token.type === TokenType.int_lit) {
            return { variant: { intLit: token }, type: "intLit" };
        } else if (token.type === TokenType.ident) {
            return { variant: { identifier: token }, type: "ident" };
        } else if (token.type === TokenType.open_paren) {
            const expr = this.parseExpr();
            if (!expr) {
                throw new Error("Invalid expression!");
            }
            this.tryConsume(TokenType.close_paren, "Expected ')'");
            return { variant: { expr: expr }, type: "parens" };
        } else {
            return null;
        }
    }

    /** Parse the next token(s) to a statement
     * @returns {Nodes.Statement | null} the create statement
     * */
    private parseStatement(): Nodes.Statement | null {
        if (this.peek()?.type === TokenType.exit) {
            this.consume();
            let statementExit: Nodes.StatementExit;

            //get expr inside exit
            const expr = this.parseExpr();
            if (expr) {
                statementExit = { expr: expr };
            } else {
                throw new Error("Invalid expression");
            }
            //missing semi
            if (this.peek()?.type === TokenType.semi) {
                this.consume();
            } else {
                throw new Error("Missing '🚀'");
            }

            return { variant: statementExit, type: "exit" };
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
            let statementLet: Nodes.StatementLet;
            //equals
            this.consume();

            //parse expression
            const expr = this.parseExpr();
            if (expr) {
                statementLet = { ident: ident, expr: expr };
            } else {
                throw new Error("Invalid expression");
            }

            //missing semi
            if (this.peek()?.type === TokenType.semi) {
                this.consume();
            } else {
                throw new Error("Expected '🚀'");
            }
            return { variant: statementLet, type: "let" };
        } else if (this.tryConsume(TokenType._if)) {
            this.tryConsume(TokenType.open_paren, "Expected '('");
            const exprIf = this.parseExpr();
            if (!exprIf) {
                throw new Error("invalid expression");
            }
            this.tryConsume(TokenType.open_paren, "Expected '('");
            const scope = this.parseScope();
            if (!scope) {
                throw new Error("Invalid scope");
            }
            return { type: "scope", variant: { expr: exprIf, scope: scope } };
        } else {
            return null;
        }
    }

    /** Parse the next token(s) to an expr
     * @param {number} minPrecedence the minimal precedence of this expression
     * @returns {Nodes.Expr | null} the created expr
     * */
    private parseExpr(minPrecedence: number = 0): Nodes.Expr | null {
        const termLhs = this.parseTerm();
        if (!termLhs) {
            return null;
        }

        let exprLhs: Nodes.Expr = { variant: termLhs, type: "term" };

        while (true) {
            const currentToken = this.peek();
            let precedence = 0;

            //check if the precedence of current expr is smaller than minPrecedence
            if (currentToken) {
                precedence = getBinaryPrecedence(currentToken.type);
                if (!precedence || precedence < minPrecedence) {
                    break;
                }
            } else {
                break;
            }

            //get operator and second expr
            const operator: Token = this.consume();
            const nextMinPrecedence = precedence + 1;
            const exprRhs = this.parseExpr(nextMinPrecedence);
            if (!exprRhs) {
                throw new Error("Invalid expression!");
            }
            let expr: Nodes.BinaryExpr;
            if (operator.type === TokenType.plus) {
                expr = {
                    variant: { lhs: exprLhs, rhs: exprRhs },
                    type: "add",
                };
            } else if (operator.type === TokenType.minus) {
                expr = {
                    variant: { lhs: exprLhs, rhs: exprRhs },
                    type: "sub",
                };
            } else if (operator.type === TokenType.star) {
                expr = {
                    variant: { lhs: exprLhs, rhs: exprRhs },
                    type: "mul",
                };
            } else if (operator.type === TokenType.slash) {
                expr = {
                    variant: { lhs: exprLhs, rhs: exprRhs },
                    type: "div",
                };
            } else if (operator.type === TokenType.pow) {
                expr = {
                    variant: { lhs: exprLhs, rhs: exprRhs },
                    type: "pow",
                };
            } else {
                console.assert(false);
            }
            exprLhs = { type: "binExpr", variant: expr };
        }
        return exprLhs;
    }

    /**parse the coming scope in from the tokens
     * @returns {Nodes.Scope} the created scope
     * */
    parseScope(): Nodes.Scope {
        this.tryConsume(TokenType.open_curly, "Expected '{'");
        let scope: Nodes.Scope = { statements: [] };
        let statement = this.parseStatement();
        while (statement) {
            scope.statements.push(statement);
            statement = this.parseStatement();
        }
        this.tryConsume(TokenType.close_curly, "Expected '}'");
        return scope;
    }

    /**Parse the tokens to an understandable parse tree
     * @returns {Nodes.Program | null} the root node of the parse tree
     * */
    parseProgram(): Nodes.Program | null {
        let program: Nodes.Program = { statements: [] };
        while (this.peek()) {
            const statement = this.parseStatement();
            if (statement) {
                program.statements.push(statement);
            } else {
                throw new Error("Invalid statement");
            }
        }
        return program;
    }
}
