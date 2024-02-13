import { Expression } from "./Expressions";
import { Scope } from "./Scope";
import { checkLiteralType } from "../parser";
import { LiteralType } from "../types";

export class IfPredicate {
    readonly line: number;
    constructor(line: number) {
        this.line = line;
    }
}

export class ElseIfPredicate extends IfPredicate {
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

export class ElsePredicate extends IfPredicate {
    readonly scope: Scope;

    constructor(scope: Scope, line: number) {
        super(line);
        this.scope = scope;
    }
}
