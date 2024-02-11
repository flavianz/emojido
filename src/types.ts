export enum TokenType {
    exit = "exit",
    int_lit = "int_lit",
    semi = "semi",
    open_paren = "open_paren",
    close_paren = "close_paren",
    ident = "ident",
    let = "let",
    equals = "equals",
    plus = "plus",
    minus = "minus",
    star = "star",
    slash = "slash",
    pow = "pow",
    open_curly = "open_curly",
    close_curly = "close_curly",
    if = "if",
    elseif = "elseif",
    else = "else",
    double_equals = "double_equals",
    not_equals = "",
    boolean_lit = "bool_lit",
    and = "and",
    or = "or",
    xor = "xor",
    type = "type",
    quotes = "quotes",
    string = "string",
    print = "print",
    smaller = "smaller",
    smallerEquals = "smallerEquals",
    greater = "greater",
    greaterEquals = "greaterEquals",
}

export interface Token {
    type: TokenType;
    value?: string;
    line: number;
}

export namespace Nodes {
    export interface Program {
        statements: Statement[];
    }

    export interface Statement {
        variant:
            | StatementExit
            | StatementPrint
            | StatementLet
            | StatementIf
            | Scope
            | StatementAssign;
        type: "exit" | "let" | "if" | "scope" | "assign" | "print";
    }

    export interface StatementExit {
        expr: Expr;
    }
    export interface StatementPrint {
        expr: Expr;
    }

    export interface StatementLet {
        ident: Token;
        expr: Expr;
    }

    export interface StatementAssign {
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

    export interface TermBool {
        bool: Token;
    }

    export interface TermString {
        string: Token;
    }

    export interface TermIdent {
        ident: Token;
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

    export interface BoolBinaryExprComp {
        lhs: Expr;
        rhs: Expr;
    }
    export interface BoolBinaryExprNotComp {
        lhs: Expr;
        rhs: Expr;
    }
    export interface BoolBinaryExprGreaterThan {
        lhs: Expr;
        rhs: Expr;
    }
    export interface BoolBinaryExprGreaterEquals {
        lhs: Expr;
        rhs: Expr;
    }
    export interface BoolBinaryExprSmallerThan {
        lhs: Expr;
        rhs: Expr;
    }
    export interface BoolBinaryExprSmallerEquals {
        lhs: Expr;
        rhs: Expr;
    }

    export interface BinaryExpr {
        variant:
            | BinaryExprAdd
            | BinaryExprSub
            | BinaryExprMul
            | BinaryExprDiv
            | BinaryExprPow
            | BoolBinaryExprAnd
            | BoolBinaryExprOr
            | BoolBinaryExprXor
            | BoolBinaryExprComp
            | BoolBinaryExprNotComp
            | BoolBinaryExprSmallerThan
            | BoolBinaryExprSmallerEquals
            | BoolBinaryExprGreaterEquals
            | BoolBinaryExprGreaterThan;
        type:
            | "add"
            | "sub"
            | "mul"
            | "div"
            | "pow"
            | "comp"
            | "notComp"
            | "and"
            | "or"
            | "xor"
            | "grater"
            | "greaterEquals"
            | "smaller"
            | "smallerEquals";
    }

    export interface BoolBinaryExprAnd {
        lhs: Expr;
        rhs: Expr;
    }

    export interface BoolBinaryExprOr {
        lhs: Expr;
        rhs: Expr;
    }

    export interface BoolBinaryExprXor {
        lhs: Expr;
        rhs: Expr;
    }

    export interface Term {
        variant: TermIntLit | TermIdent | TermParens | TermBool | TermString;
        type: "intLit" | "ident" | "parens" | "boolLit" | "string";
    }
    export interface Scope {
        statements: Statement[];
    }

    export interface IfPredicate {
        variant: ElseIf | Else;
        type: "elseIf" | "else";
    }

    export interface ElseIf {
        expr: Expr;
        scope: Scope;
        predicate?: IfPredicate;
    }

    export interface Else {
        scope: Scope;
    }

    export interface StatementIf {
        expr: Expr;
        scope: Scope;
        predicate?: IfPredicate;
    }
}

export interface Var {
    stackLocation: number;
    type: "int" | "bool" | "string";
}
