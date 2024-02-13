import { Expression } from "./Expressions";
import { LiteralType, Token } from "../types";
import { checkLiteralType } from "../parser";
import { Scope } from "./Scope";
import { IfPredicate } from "./IfPredicates";

export class Statement {
    readonly line: number;

    constructor(line: number) {
        this.line = line;
    }
}

export class StatementLet extends Statement {
    readonly expression: Expression;
    readonly identifier: string;

    constructor(expression: Expression, identifier: Token, line: number) {
        super(line);
        this.expression = expression;
        this.identifier = identifier.value;
        //TODO: typechecking of variable
    }
}
export class StatementExit extends Statement {
    readonly expression: Expression;

    constructor(expression: Expression, line: number) {
        super(line);
        this.expression = expression;
        checkLiteralType(
            expression.literalType,
            [LiteralType.integerLiteral],
            line,
        );
    }
}
export class StatementPrint extends Statement {
    readonly expression: Expression;

    constructor(expression: Expression, line: number) {
        super(line);
        this.expression = expression;
        checkLiteralType(
            expression.literalType,
            [LiteralType.integerLiteral, LiteralType.stringLiteral],
            line,
        );
    }
}

export class StatementAssign extends Statement {
    readonly expression: Expression;
    readonly identifier: string;

    constructor(expression: Expression, identifier: Token, line: number) {
        super(line);
        this.expression = expression;
        this.identifier = identifier.value;
        //TODO: typechecking of variable
    }
}
export class StatementScope extends Statement {
    readonly scope: Scope;

    constructor(scope: Scope, line: number) {
        super(line);
        this.scope = scope;
    }
}

export class StatementIf extends Statement {
    readonly expression: Expression;
    readonly scope: Scope;
    readonly predicate?: IfPredicate;

    constructor(
        expression: Expression,
        scope: Scope,
        line: number,
        predicate?: IfPredicate,
    ) {
        super(line);
        this.expression = expression;
        this.scope = scope;
        this.predicate = predicate;
        checkLiteralType(
            expression.literalType,
            [LiteralType.booleanLiteral],
            line,
        );
    }
}
