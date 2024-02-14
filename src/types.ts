import { FunctionArgument } from "./classes/Functions";

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
    float = "float",
    typeInt = "typeInt",
    typeFloat = "typeFloat",
    typeBool = "typeBool",
    function = "function",
    return = "return",
    comma = "comma",
    callFunction = "callFunction",
    typeString = "typeString",
}

export enum LiteralType {
    integerLiteral = "integerLiteral",
    floatLiteral = "floatLiteral",
    stringLiteral = "stringLiteral",
    booleanLiteral = "booleanLiteral",
}

export interface Token {
    type: TokenType;
    value?: string;
    line: number;
}

export interface Var {
    stackLocation: number;
    type: LiteralType;
}
export interface VarFunction {
    returnType: LiteralType;
    arguments: FunctionArgument[];
}
