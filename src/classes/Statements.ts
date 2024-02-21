import { Expression } from "./Expressions";
import { LiteralType, Token } from "../types";
import { checkLiteralType } from "../parser";
import { Scope } from "./Scope";
import { IfPredicate } from "./IfPredicates";
import { Term } from "./Terms";

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
            [
                LiteralType.integerLiteral,
                LiteralType.stringLiteral,
                LiteralType.booleanLiteral,
            ],
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
export class StatementWhile extends Statement {
    readonly expression: Expression;
    readonly scope: Scope;

    constructor(expression: Expression, scope: Scope, line: number) {
        super(line);
        this.expression = expression;
        this.scope = scope;
        checkLiteralType(
            expression.literalType,
            [LiteralType.booleanLiteral],
            line,
        );
    }
}
export class StatementFor extends Statement {
    readonly statementAssign: StatementLet | StatementAssign;
    readonly statementModify: StatementAssign;
    readonly expression: Expression;
    readonly scope: Scope;

    constructor(
        statementAssign: StatementLet | StatementAssign,
        expression: Expression,
        statementModify: StatementAssign,
        scope: Scope,
        line: number,
    ) {
        super(line);
        this.expression = expression;
        this.scope = scope;
        this.statementAssign = statementAssign;
        this.statementModify = statementModify;
        checkLiteralType(
            expression.literalType,
            [LiteralType.booleanLiteral],
            line,
        );
    }
}

export class StatementTerm extends Statement {
    readonly term: Term;

    constructor(line: number, term: Term) {
        super(line);
        this.term = term;
    }
}

export class StatementReturn extends Statement {
    readonly expression: Expression;

    constructor(expression: Expression, line: number) {
        super(line);
        this.expression = expression;
    }
}
