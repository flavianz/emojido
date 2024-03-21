import { Expression } from "./Expressions";
import { Scope } from "./Scope";
import { checkLiteralType } from "../parser";
import { LineCount, LiteralType } from "../types";

export class IfPredicate {
    readonly line: LineCount;
    constructor(line: LineCount) {
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
        line: LineCount,
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

    constructor(scope: Scope, line: LineCount) {
        super(line);
        this.scope = scope;
    }
}
