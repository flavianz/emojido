import { Expression } from "./Expressions";
import { LiteralType } from "../types";
import { TermIdentifier } from "./Terms";
import { Statement } from "./Statements";
import { Scope } from "./Scope";

export class StatementFunctionDefinition extends Statement {
    readonly arguments: FunctionArgument[];
    readonly identifier: string;
    readonly returnType: LiteralType;
    readonly scope: Scope;

    constructor(
        returnType: LiteralType,
        identifier: string,
        arguments_: FunctionArgument[],
        line: number,
        scope: Scope,
    ) {
        super(line);
        this.arguments = arguments_;
        this.identifier = identifier;
        this.returnType = returnType;
        this.scope = scope;
    }
}

export class TermFunctionCall extends TermIdentifier {
    readonly arguments: Expression[];
    constructor(
        identifier: string,
        literalType: LiteralType,
        arguments_: Expression[],
        line: number,
    ) {
        super(line, identifier, literalType);
        this.arguments = arguments_;
    }
}

export class FunctionArgument {
    readonly type: LiteralType;
    readonly identifier: string;

    constructor(type: LiteralType, identifier: string) {
        this.type = type;
        this.identifier = identifier;
    }
}
