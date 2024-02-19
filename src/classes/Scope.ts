import { Statement } from "./Statements";

export class Scope {
    readonly statements: Statement[];
    readonly startLine: number;
    readonly innerScopeDepth: number;

    constructor(
        statements: Statement[],
        startLine: number,
        scopeDepth: number,
    ) {
        this.statements = statements;
        this.startLine = startLine;
        this.innerScopeDepth = scopeDepth;
    }
}
