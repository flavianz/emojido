import { LiteralType } from "../types";
import { Expression } from "./Expressions";

export class Term extends Expression {
    constructor(literalType: LiteralType, line: number) {
        super(literalType, line);
    }
}

export class TermInteger extends Term {
    readonly integerValue: string;

    constructor(line: number, integerValue: string) {
        super(LiteralType.integerLiteral, line);
        this.integerValue = integerValue;
    }
}

export class TermFloat extends Term {
    readonly floatValue: string;

    constructor(line: number, floatValue: string) {
        super(LiteralType.floatLiteral, line);
        this.floatValue = floatValue;
    }
}

export class TermBoolean extends Term {
    readonly booleanValue: string;

    constructor(line: number, booleanValue: string) {
        super(LiteralType.booleanLiteral, line);
        this.booleanValue = booleanValue;
    }
}

export class TermString extends Term {
    readonly stringValue: string;

    constructor(line: number, stringValue: string) {
        super(LiteralType.stringLiteral, line);
        this.stringValue = stringValue;
    }
}

export class TermIdentifier extends Term {
    readonly identifier: string;

    constructor(line: number, identifier: string, literalType: LiteralType) {
        super(literalType, line);
        this.identifier = identifier;
    }
}

export class TermParens extends Term {
    readonly expression: Expression;

    constructor(expression: Expression, line: number) {
        super(expression.literalType, line);
        this.expression = expression;
    }
}

export class TermNull extends Term {
    constructor(line: number) {
        super(LiteralType.nullLiteral, line);
    }
}
