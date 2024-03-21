import { LineCount, LiteralType } from "../types";
import { Expression } from "./Expressions";
import { checkLiteralType } from "../parser";
import { StatementFunctionDefinition } from "./Functions";
import { StatementLet } from "./Statements";
import { VariableObject } from "./Object";

export class Term extends Expression {
    constructor(literalType: LiteralType, line: LineCount) {
        super(literalType, line);
    }
}

export class TermInteger extends Term {
    readonly integerValue: string;

    constructor(line: LineCount, integerValue: string) {
        super(LiteralType.integerLiteral, line);
        this.integerValue = integerValue;
    }
}

export class TermFloat extends Term {
    readonly floatValue: string;

    constructor(line: LineCount, floatValue: string) {
        super(LiteralType.floatLiteral, line);
        this.floatValue = floatValue;
    }
}

export class TermBoolean extends Term {
    readonly booleanValue: string;

    constructor(line: LineCount, booleanValue: string) {
        super(LiteralType.booleanLiteral, line);
        this.booleanValue = booleanValue;
    }
}

export class TermString extends Term {
    readonly stringValue: string;

    constructor(line: LineCount, stringValue: string) {
        super(LiteralType.stringLiteral, line);
        this.stringValue = stringValue;
    }
}

export class TermIdentifier extends Term {
    readonly identifier: string;

    constructor(line: LineCount, identifier: string, literalType: LiteralType) {
        super(literalType, line);
        this.identifier = identifier;
    }
}

export class TermParens extends Term {
    readonly expression: Expression;
    constructor(expression: Expression, line: LineCount) {
        super(expression.literalType, line);
        this.expression = expression;
    }
}

export class TermNull extends Term {
    constructor(line: LineCount) {
        super(LiteralType.nullLiteral, line);
    }
}

export class TermArray extends Term {
    readonly values: Term[];
    readonly valueType: LiteralType;

    constructor(valueType: LiteralType, values: Term[], line: LineCount) {
        super(LiteralType.arrayLiteral, line);
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
        line: LineCount,
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
export class TermObject extends Term implements VariableObject {
    functions: Map<string, StatementFunctionDefinition>;
    vars: Map<string, StatementLet>;
    constructor(
        literalType: LiteralType,
        values: Map<string, StatementLet>,
        functionDefinitions: Map<string, StatementFunctionDefinition>,
        line: LineCount,
    ) {
        super(literalType, line);
        this.vars = values;
        this.functions = functionDefinitions;
    }
}
export class TermParseToFloat extends Term {
    readonly expression: Expression;
    constructor(expression: Expression, line: LineCount) {
        super(LiteralType.floatLiteral, line);
        checkLiteralType(
            expression.literalType,
            [LiteralType.integerLiteral],
            line,
        );
        this.expression = expression;
    }
}

export class TermParseToInt extends Term {
    readonly expression: Expression;
    constructor(expression: Expression, line: LineCount) {
        super(LiteralType.integerLiteral, line);
        checkLiteralType(
            expression.literalType,
            [LiteralType.floatLiteral],
            line,
        );
        this.expression = expression;
    }
}
export class TermParseToString extends Term {
    readonly expression: Expression;
    constructor(expression: Expression, line: LineCount) {
        super(LiteralType.stringLiteral, line);
        checkLiteralType(
            expression.literalType,
            [LiteralType.integerLiteral],
            line,
        );
        this.expression = expression;
    }
}

export class TermPointer extends Term {
    readonly expressionPointedTo: Expression;
    constructor(expressionPointedTo: Expression, line: LineCount) {
        super(LiteralType.integerLiteral, line);
        this.expressionPointedTo = expressionPointedTo;
    }
}

export class TermMemoryAccess extends Term {
    readonly address: Expression;
    constructor(
        literalType: LiteralType,
        address: Expression,
        line: LineCount,
    ) {
        super(literalType, line);
        this.address = address;
    }
}
