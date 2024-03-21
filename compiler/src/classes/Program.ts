import { Statement } from "./Statements";

export class Program {
    readonly statements: Statement[];

    constructor(statements: Statement[]) {
        this.statements = statements;
    }
}
