export enum TokenType {
    exit = "exit",
    int_lit = "int_lit",
    semi = "semi",
    open_paren = "open_paren",
    close_paren = "close_paren",
    ident = "ident",
    let = "let",
    equals = "equals",
}

export interface Token {
    type: TokenType;
    value?: string;
}

export interface NodeProgram {
    statements: NodeStatement[];
}

export interface NodeStatement {
    variant: NodeStatementExit | NodeStatementLet;
}

export interface NodeStatementExit {
    expr: NodeExpr;
    type: "exit";
}

export interface NodeStatementLet {
    ident: Token;
    expr: NodeExpr;
    type: "let";
}

export interface NodeExpr {
    variant: NodeExprIdent | NodeExprIntLit;
}

export interface NodeExprIntLit {
    intLit: Token;
    type: "intLit";
}

export interface NodeExprIdent {
    identifier: Token;
    type: "ident";
}

export interface Var {
    stackLocation: number;
}
