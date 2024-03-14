import { Expression } from "./Expressions";
import { LineCount, LiteralType, Token } from "../types";
import { checkLiteralType } from "../parser";
import { Scope } from "./Scope";
import { IfPredicate } from "./IfPredicates";
import { Term } from "./Terms";
import { StatementFunctionDefinition } from "./Functions";

export class Statement {
    readonly line: LineCount;

    constructor(line: LineCount) {
        this.line = line;
    }
}

export class StatementLet extends Statement {
    readonly expression: Expression;
    readonly identifier: string;

    constructor(expression: Expression, identifier: Token, line: LineCount) {
        super(line);
        this.expression = expression;
        this.identifier = identifier.value;
    }
}
export class StatementExit extends Statement {
    readonly expression: Expression;

    constructor(expression: Expression, line: LineCount) {
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

    constructor(expression: Expression, line: LineCount) {
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

    constructor(expression: Expression, identifier: Token, line: LineCount) {
        super(line);
        this.expression = expression;
        this.identifier = identifier.value;
    }
}
export class StatementScope extends Statement {
    readonly scope: Scope;

    constructor(scope: Scope, line: LineCount) {
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
export class StatementWhile extends Statement {
    readonly expression: Expression;
    readonly scope: Scope;

    constructor(expression: Expression, scope: Scope, line: LineCount) {
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
        line: LineCount,
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

    constructor(line: LineCount, term: Term) {
        super(line);
        this.term = term;
    }
}

export class StatementReturn extends Statement {
    readonly expression: Expression;

    constructor(expression: Expression, line: LineCount) {
        super(line);
        this.expression = expression;
    }
}
export class StatementImport extends Statement {
    readonly statements: Statement[];
    constructor(statements: Statement[], line: LineCount) {
        super(line);
        this.statements = statements;
    }
}

export class StatementAssembly extends Statement {
    readonly text: string;
    readonly data: string;
    readonly bss: string;

    constructor(text: string, data: string, bss: string, line: LineCount) {
        super(line);
        this.text = text;
        this.data = data;
        this.bss = bss;
    }
}

export class StatementMemoryModification extends Statement {
    readonly address: Expression;
    readonly expression: Expression;

    constructor(address: Expression, expression: Expression, line: LineCount) {
        super(line);
        this.address = address;
        this.expression = expression;
    }
}
