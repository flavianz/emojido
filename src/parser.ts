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
    private tryConsume(
        type: TokenType,
        error: { error: string; line: number } = { error: "", line: 0 },
    ): Token | null {
        if (this.peek()?.type === type) {
            return this.consume();
        } else if (error.line === 0) {
            return null;
        } else {
            this.error(error.error, error.line);
        }
    }

    private error(error: string, line: number) {
        throw new Error(`[Parse Error]: ${error} on line ${line}`);
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
        if (token?.type === TokenType.int_lit) {
            return { variant: { intLit: token }, type: "intLit" };
        } else if (token?.type === TokenType.ident) {
            return { variant: { ident: token }, type: "ident" };
        } else if (token?.type === TokenType.quotes) {
            const value = this.tryConsume(TokenType.string, {
                error: "Expected string",
                line: token.line,
            });
            this.tryConsume(TokenType.quotes, {
                error: "Expected '🔠'",
                line: token.line,
            });
            return { variant: { string: value }, type: "string" };
        } else if (token?.type === TokenType.boolean_lit) {
            return { variant: { bool: token }, type: "boolLit" };
        } else if (token?.type === TokenType.open_paren) {
            const expr = this.parseExpr();
            if (!expr) {
                this.error("Invalid expression", token.line);
            }
            this.tryConsume(TokenType.close_paren, {
                error: "Expected '🧱'",
                line: token.line,
            });
            return { variant: { expr: expr }, type: "parens" };
        } else {
            return null;
        }
    }

    /**Parse the else if or else statement
     * */
    private parseIfPredicate(): Nodes.IfPredicate {
        const predicate = this.consume();
        if (predicate?.type === TokenType.elseif) {
            //get the expression
            const expr = this.parseExpr();
            if (!expr) {
                this.error("Expected expression", predicate.line);
            }
            this.tryConsume(TokenType.elseif, {
                error: "Expected '📐'",
                line: predicate.line,
            });

            //get the scope
            const scope = this.parseScope();
            if (!scope) {
                this.error("Invalid scope", predicate.line);
            }
            //get the optional next predicate
            const ifPredicate = this.parseIfPredicate();

            return {
                variant: { expr: expr, scope: scope, predicate: ifPredicate },
                type: "elseIf",
            };
        } else if (predicate?.type === TokenType.else) {
            //get the scope
            const scope = this.parseScope();
            if (!scope) {
                this.error("Invalid scope", predicate.line);
            }
            return { variant: { scope: scope }, type: "else" };
        }
    }

    /** Parse the next token(s) to a statement
     * @returns {Nodes.Statement | null} the create statement
     * */
    private parseStatement(): Nodes.Statement | null {
        if (this.peek()?.type === TokenType.exit) {
            const line = this.consume().line;
            let statementExit: Nodes.StatementExit;

            //get expr inside exit
            const expr = this.parseExpr();
            if (expr) {
                statementExit = { expr: expr };
            } else {
                this.error("Invalid expression", line);
            }
            //missing semi
            this.tryConsume(TokenType.semi, { error: "Missing '🚀'", line });

            return { variant: statementExit, type: "exit" };
        } else if (this.peek()?.type === TokenType.print) {
            const line = this.consume().line;

            let statementPrint: Nodes.StatementPrint;

            const expr = this.parseExpr();
            if (expr) {
                statementPrint = { expr: expr };
            } else {
                this.error("Invalid expression", line);
            }

            this.tryConsume(TokenType.semi, { error: "Missing '🚀'", line });

            return { variant: statementPrint, type: "print" };
        }
        //case let statement
        else if (this.peek()?.type === TokenType.let) {
            //let
            const line = this.consume().line;

            const ident = this.consume();
            let statementLet: Nodes.StatementLet;
            //equals
            this.consume();

            //parse expression
            const expr = this.parseExpr();
            if (expr) {
                statementLet = { ident: ident, expr: expr };
            } else {
                this.error("Invalid expression", line);
            }

            //missing semi
            if (this.peek()?.type === TokenType.semi) {
                this.consume();
            } else {
                this.error("Expected '🚀'", line);
            }
            return { variant: statementLet, type: "let" };
        } else if (
            this.peek()?.type === TokenType.ident &&
            this.peek(1)?.type === TokenType.equals
        ) {
            const ident = this.consume();
            //the equals
            this.consume();

            const expr = this.parseExpr();
            if (!expr) {
                this.error("Expected expression", ident.line);
            }
            this.tryConsume(TokenType.semi, {
                error: "Expected '🚀'",
                line: ident.line,
            });
            return { type: "assign", variant: { expr: expr, ident: ident } };
        } else if (this.peek()?.type === TokenType.if) {
            const line = this.consume().line;
            //get expr
            const exprIf = this.parseExpr();
            if (!exprIf) {
                this.error("Invalid expression", line);
            }
            this.tryConsume(TokenType.if, {
                error: "Expected '✂️'",
                line: line,
            });
            //get scope
            const scope = this.parseScope();
            if (!scope) {
                this.error("Invalid scope", line);
            }
            return {
                type: "if",
                variant: {
                    expr: exprIf,
                    scope: scope,
                    //can be undefined
                    predicate: this.parseIfPredicate(),
                },
            };
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
            let precedence: number;

            //check if the precedence of current expr is smaller than minPrecedence
            if (currentToken) {
                precedence = getBinaryPrecedence(currentToken.type);
                if (precedence === null || precedence < minPrecedence) {
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
                this.error("Invalid expression", operator.line);
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
            } else if (operator.type === TokenType.double_equals) {
                expr = {
                    variant: { lhs: exprLhs, rhs: exprRhs },
                    type: "comp",
                };
            } else if (operator.type === TokenType.not_equals) {
                expr = {
                    variant: { lhs: exprLhs, rhs: exprRhs },
                    type: "notComp",
                };
            } else if (operator.type === TokenType.or) {
                expr = {
                    variant: { lhs: exprLhs, rhs: exprRhs },
                    type: "or",
                };
            } else if (operator.type === TokenType.and) {
                expr = {
                    variant: { lhs: exprLhs, rhs: exprRhs },
                    type: "and",
                };
            } else if (operator.type === TokenType.xor) {
                expr = {
                    variant: { lhs: exprLhs, rhs: exprRhs },
                    type: "xor",
                };
            } else if (operator.type === TokenType.smaller) {
                expr = {
                    variant: { lhs: exprLhs, rhs: exprRhs },
                    type: "smaller",
                };
            } else if (operator.type === TokenType.smallerEquals) {
                expr = {
                    variant: { lhs: exprLhs, rhs: exprRhs },
                    type: "smallerEquals",
                };
            } else if (operator.type === TokenType.greater) {
                expr = {
                    variant: { lhs: exprLhs, rhs: exprRhs },
                    type: "grater",
                };
            } else if (operator.type === TokenType.greaterEquals) {
                expr = {
                    variant: { lhs: exprLhs, rhs: exprRhs },
                    type: "greaterEquals",
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
        this.tryConsume(TokenType.open_curly, {
            error: "Expected '⚽'",
            line: this.peek()?.line ?? -1,
        });
        let scope: Nodes.Scope = { statements: [] };
        let statement = this.parseStatement();
        while (statement) {
            scope.statements.push(statement);
            statement = this.parseStatement();
        }
        this.tryConsume(TokenType.close_curly, {
            error: "Expected '🥅'",
            line: this.peek()?.line ?? -1,
        });
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
