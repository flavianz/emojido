import { LiteralType } from "../types";
import { Expression } from "./Expressions";
import { checkLiteralType } from "../parser";
import { StatementFunctionDefinition } from "./Functions";
import { StatementLet } from "./Statements";
import { VariableObject } from "./Object";

export class Term extends Expression implements VariableObject {
    functions: Map<string, StatementFunctionDefinition>;
    vars: Map<string, StatementLet>;
    constructor(
        literalType: LiteralType,
        line: number,
        functions: Map<string, StatementFunctionDefinition>,
        vars: Map<string, StatementLet>,
    ) {
        super(literalType, line);
        this.vars = vars;
        this.functions = functions;
    }
}

export class TermInteger extends Term {
    readonly integerValue: string;

    constructor(line: number, integerValue: string) {
        super(LiteralType.integerLiteral, line, new Map(), new Map());
        this.integerValue = integerValue;
    }
}

export class TermFloat extends Term {
    readonly floatValue: string;

    constructor(line: number, floatValue: string) {
        super(LiteralType.floatLiteral, line, new Map(), new Map());
        this.floatValue = floatValue;
    }
}

export class TermBoolean extends Term {
    readonly booleanValue: string;

    constructor(line: number, booleanValue: string) {
        super(LiteralType.booleanLiteral, line, new Map(), new Map());
        this.booleanValue = booleanValue;
    }
}

export class TermString extends Term {
    readonly stringValue: string;

    constructor(line: number, stringValue: string) {
        super(LiteralType.stringLiteral, line, new Map(), new Map());
        this.stringValue = stringValue;
    }
}

export class TermIdentifier extends Term {
    readonly identifier: string;

    constructor(line: number, identifier: string, literalType: LiteralType) {
        super(literalType, line, new Map(), new Map());
        this.identifier = identifier;
    }
}

export class TermParens extends Term {
    readonly expression: Expression;
    constructor(expression: Expression, line: number) {
        super(expression.literalType, line, new Map(), new Map());
        this.expression = expression;
    }
}

export class TermNull extends Term {
    constructor(line: number) {
        super(LiteralType.nullLiteral, line, new Map(), new Map());
    }
}

export class TermArray extends Term {
    readonly values: Term[];
    readonly valueType: LiteralType;

    constructor(valueType: LiteralType, values: Term[], line: number) {
        super(LiteralType.arrayLiteral, line, new Map(), new Map());
        this.values = values;
        this.valueType = valueType;
    }
}

export class TermArrayAccess extends TermIdentifier {
    readonly expression: Expression;
    constructor(
        identifier: string,
        literalType: LiteralType,
        expression: Expression,
        line: number,
    ) {
        super(line, identifier, literalType);
        this.expression = expression;
        checkLiteralType(
            this.expression.literalType,
            [LiteralType.integerLiteral],
            line,
        );
    }
}
export class TermObject extends Term {
    constructor(
        literalType: LiteralType,
        values: Map<string, StatementLet>,
        functionDefinitions: Map<string, StatementFunctionDefinition>,
        line: number,
    ) {
        super(literalType, line, functionDefinitions, values);
    }
}
