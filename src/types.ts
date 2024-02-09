export enum TokenType {
    exit,
    int_lit,
    semi,
    open_paren,
    close_paren,
    ident,
    let,
    equals,
    plus,
    minus,
    star,
    slash,
    pow,
    open_curly,
    close_curly,
    _if,
}

export interface Token {
    type: TokenType;
    value?: string;
}

export namespace Nodes {
    export interface Program {
        statements: Statement[];
    }

    export interface Statement {
        variant: StatementExit | StatementLet | StatementIf | Scope;
        type: "exit" | "let" | "if" | "scope";
    }

    export interface StatementExit {
        expr: Expr;
    }

    export interface StatementLet {
        ident: Token;
        expr: Expr;
    }

    export interface Expr {
        variant: Term | BinaryExpr;
        type: "term" | "binExpr";
    }

    export interface TermIntLit {
        intLit: Token;
    }

    export interface TermIdent {
        identifier: Token;
    }

    export interface TermParens {
        expr: Expr;
    }

    export interface BinaryExprAdd {
        lhs: Expr;
        rhs: Expr;
    }
    export interface BinaryExprSub {
        lhs: Expr;
        rhs: Expr;
    }
    export interface BinaryExprMul {
        lhs: Expr;
        rhs: Expr;
    }
    export interface BinaryExprDiv {
        lhs: Expr;
        rhs: Expr;
    }
    export interface BinaryExprPow {
        lhs: Expr;
        rhs: Expr;
    }

    export interface BinaryExpr {
        variant:
            | BinaryExprAdd
            | BinaryExprSub
            | BinaryExprMul
            | BinaryExprDiv
            | BinaryExprPow;
        type: "add" | "sub" | "mul" | "div" | "pow";
    }
    export interface Term {
        variant: TermIntLit | TermIdent | TermParens;
        type: "intLit" | "ident" | "parens";
    }
    export interface Scope {
        statements: Statement[];
    }
    export interface StatementIf {
        expr: Expr;
        scope: Scope;
    }
}

export interface Var {
    stackLocation: number;
}
