import { LiteralType, Token, TokenType } from "./types";
import { error, getBinaryPrecedence } from "./tokenization";
import {
    Term,
    TermBoolean,
    TermFloat,
    TermIdentifier,
    TermInteger,
    TermParens,
    TermString,
} from "./classes/Terms";
import { Expression } from "./classes/Expressions";
import {
    ElseIfPredicate,
    ElsePredicate,
    IfPredicate,
} from "./classes/IfPredicates";
import { Scope } from "./classes/Scope";
import {
    Statement,
    StatementAssign,
    StatementExit,
    StatementIf,
    StatementLet,
    StatementPrint,
} from "./classes/Statements";
import {
    BinaryExpression,
    BinaryExpressionAdd,
    BinaryExpressionDiv,
    BinaryExpressionMul,
    BinaryExpressionPow,
    BinaryExpressionSub,
    BooleanBinaryExpressionAnd,
    BooleanBinaryExpressionCompare,
    BooleanBinaryExpressionGreaterEquals,
    BooleanBinaryExpressionGreaterThan,
    BooleanBinaryExpressionLessEquals,
    BooleanBinaryExpressionLessThan,
    BooleanBinaryExpressionNotCompare,
    BooleanBinaryExpressionOr,
    BooleanBinaryExpressionXor,
} from "./classes/BinaryExpressions";
import { Program } from "./classes/Program";

const literalTypeToEmoji = {
    integerLiteral: "🔢",
    floatLiteral: "🧮",
    stringLiteral: "🔠",
    booleanLiteral: "⚜️",
};

export function getEmojiFromLiteralType(literalType: LiteralType) {
    return literalTypeToEmoji[literalType];
}

export function checkLiteralType(
    provided: LiteralType,
    required: LiteralType[],
    line: number,
) {
    if (!required.includes(provided)) {
        let expected = "";
        required.forEach((literalType, index) => {
            expected += ` '${getEmojiFromLiteralType(literalType)}' ${index === required.length - 1 ? "" : " or"}`;
        });
        error(
            `Expected type${expected}, but got type ${getEmojiFromLiteralType(provided)}`,
            line,
        );
    }
}

export class Parser {
    private index: number = 0;
    private readonly tokens: Token[];
    private vars = new Map<string, LiteralType>();

    private removeVars(count: number) {
        let keys = Array.from(this.vars.keys());
        for (let i = 0; i < count; i++) {
            keys.pop();
        }
        this.vars = new Map<string, LiteralType>(
            [...this.vars.entries()].filter(([key, _value]) =>
                keys.includes(key),
            ),
        );
    }

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
     * @returns {Term | null} the parsed term
     * */
    private parseTerm(): Term | null {
        const token = this.consume();
        if (token?.type === TokenType.int_lit) {
            return new TermInteger(token.line, token.value);
        } else if (token?.type === TokenType.float) {
            return new TermFloat(token.line, token.value);
        } else if (token?.type === TokenType.ident) {
            if (!this.vars.has(token.value)) {
                error(`Undeclared identifier '${token.value}'`, token.line);
            }
            return new TermIdentifier(
                token.line,
                token.value,
                this.vars.get(token.value),
            );
        } else if (token?.type === TokenType.quotes) {
            const value = this.tryConsume(TokenType.string, {
                error: "Expected string",
                line: token.line,
            });
            this.tryConsume(TokenType.quotes, {
                error: "Expected '🔠'",
                line: token.line,
            });
            return new TermString(token.line, value.value);
        } else if (token?.type === TokenType.boolean_lit) {
            return new TermBoolean(token.line, token.value);
        } else if (token?.type === TokenType.open_paren) {
            const expr = this.parseExpr();
            if (!expr) {
                this.error("Invalid expression", token.line);
            }
            this.tryConsume(TokenType.close_paren, {
                error: "Expected '🧱'",
                line: token.line,
            });
            return new TermParens(expr, token.line);
        } else {
            return null;
        }
    }

    /**Parse the else if or else statement
     * */
    private parseIfPredicate(): IfPredicate {
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

            return new ElseIfPredicate(
                expr,
                scope,
                predicate.line,
                ifPredicate,
            );
        } else if (predicate?.type === TokenType.else) {
            //get the scope
            const scope = this.parseScope();
            if (!scope) {
                this.error("Invalid scope", predicate.line);
            }
            return new ElsePredicate(scope, predicate.line);
        }
    }

    /** Parse the next token(s) to a statement
     * @returns {Statement | null} the create statement
     * */
    private parseStatement(): Statement | null {
        if (this.peek()?.type === TokenType.exit) {
            const line = this.consume().line;
            let statementExit: StatementExit;

            //get expr inside exit
            const expr = this.parseExpr();
            if (expr) {
                statementExit = new StatementExit(expr, line);
            } else {
                this.error("Invalid expression", line);
            }
            //missing semi
            this.tryConsume(TokenType.semi, { error: "Missing '🚀'", line });
            return statementExit;
        } else if (this.peek()?.type === TokenType.print) {
            const line = this.consume().line;

            let statementPrint: StatementPrint;

            const expr = this.parseExpr();
            if (expr) {
                statementPrint = new StatementPrint(expr, line);
            } else {
                this.error("Invalid expression", line);
            }

            this.tryConsume(TokenType.semi, { error: "Missing '🚀'", line });

            return statementPrint;
        }
        //case let statement
        else if (this.peek()?.type === TokenType.let) {
            //let
            const line = this.consume().line;

            const ident = this.consume();
            let statementLet: StatementLet;
            //equals
            this.consume();

            //parse expression
            const expr = this.parseExpr();
            if (expr) {
                statementLet = new StatementLet(expr, ident, line);
            } else {
                this.error("Invalid expression", line);
            }

            //missing semi
            if (this.peek()?.type === TokenType.semi) {
                this.consume();
            } else {
                this.error("Expected '🚀'", line);
            }
            if (this.vars.has(ident.value)) {
                error(`Identifier ${ident.value} already in use`, line);
            }
            this.vars.set(ident.value, expr.literalType);
            return statementLet;
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
            if (!this.vars.has(ident.value)) {
                error(`Variable '${ident.value}' does not exist`, ident.line);
            }
            checkLiteralType(
                expr.literalType,
                [this.vars.get(ident.value)],
                ident.line,
            );
            return new StatementAssign(expr, ident, ident.line);
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
            return new StatementIf(
                exprIf,
                scope,
                line,
                this.parseIfPredicate(),
            );
        } else {
            return null;
        }
    }

    /** Parse the next token(s) to an expr
     * @param {number} minPrecedence the minimal precedence of this expression
     * @returns {Expression | null} the created expr
     * */
    private parseExpr(minPrecedence: number = 0): Expression | null {
        let exprLhs: Expression = this.parseTerm();
        if (!exprLhs) {
            return null;
        }

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

            let expr: BinaryExpression;
            if (operator.type === TokenType.plus) {
                expr = new BinaryExpressionAdd(exprLhs, exprRhs, operator.line);
            } else if (operator.type === TokenType.minus) {
                expr = new BinaryExpressionSub(exprLhs, exprRhs, operator.line);
            } else if (operator.type === TokenType.star) {
                expr = new BinaryExpressionMul(exprLhs, exprRhs, operator.line);
            } else if (operator.type === TokenType.slash) {
                expr = new BinaryExpressionDiv(exprLhs, exprRhs, operator.line);
            } else if (operator.type === TokenType.pow) {
                expr = new BinaryExpressionPow(exprLhs, exprRhs, operator.line);
            } else if (operator.type === TokenType.double_equals) {
                expr = new BooleanBinaryExpressionCompare(
                    exprLhs,
                    exprRhs,
                    operator.line,
                );
            } else if (operator.type === TokenType.not_equals) {
                expr = new BooleanBinaryExpressionNotCompare(
                    exprLhs,
                    exprRhs,
                    operator.line,
                );
            } else if (operator.type === TokenType.or) {
                expr = new BooleanBinaryExpressionOr(
                    exprLhs,
                    exprRhs,
                    operator.line,
                );
            } else if (operator.type === TokenType.and) {
                expr = new BooleanBinaryExpressionAnd(
                    exprLhs,
                    exprRhs,
                    operator.line,
                );
            } else if (operator.type === TokenType.xor) {
                expr = new BooleanBinaryExpressionXor(
                    exprLhs,
                    exprRhs,
                    operator.line,
                );
            } else if (operator.type === TokenType.smaller) {
                expr = new BooleanBinaryExpressionLessThan(
                    exprLhs,
                    exprRhs,
                    operator.line,
                );
            } else if (operator.type === TokenType.smallerEquals) {
                expr = new BooleanBinaryExpressionLessEquals(
                    exprLhs,
                    exprRhs,
                    operator.line,
                );
            } else if (operator.type === TokenType.greater) {
                expr = new BooleanBinaryExpressionGreaterThan(
                    exprLhs,
                    exprRhs,
                    operator.line,
                );
            } else if (operator.type === TokenType.greaterEquals) {
                expr = new BooleanBinaryExpressionGreaterEquals(
                    exprLhs,
                    exprRhs,
                    operator.line,
                );
            } else {
                console.assert(false);
            }
            exprLhs = expr;
        }
        return exprLhs;
    }

    /**parse the coming scope in from the tokens
     * @returns {Scope} the created scope
     * */
    parseScope(): Scope {
        const line = this.tryConsume(TokenType.open_curly, {
            error: "Expected '⚽'",
            line: this.peek()?.line ?? -1,
        }).line;
        let scope: Scope = new Scope([], line);
        let statement = this.parseStatement();
        let count = 0;
        while (statement) {
            scope.statements.push(statement);
            if (statement instanceof StatementLet) {
                count++;
            }
            statement = this.parseStatement();
        }
        this.tryConsume(TokenType.close_curly, {
            error: "Expected '🥅'",
            line: this.peek()?.line ?? -1,
        });
        this.removeVars(count);
        return scope;
    }

    /**Parse the tokens to an understandable parse tree
     * @returns {Program | null} the root node of the parse tree
     * */
    parseProgram(): Program | null {
        let program: Program = new Program([]);
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
