export enum TokenType {
    exit = "exit",
    int_lit = "int_lit",
    semi = "semi",
}

export interface Token {
    type: TokenType;
    value?: string;
}

export interface NodeExit {
    expr: NodeExpr;
}

export interface NodeExpr {
    int_lit: Token;
}
