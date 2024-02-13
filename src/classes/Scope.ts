import { Statement } from "./Statements";

export class Scope {
    readonly statements: Statement[];
    readonly startLine: number;

    constructor(statements: Statement[], startLine: number) {
        this.statements = statements;
        this.startLine = startLine;
    }
}
