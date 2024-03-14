import { Statement } from "./Statements";
import { LineCount } from "../types";

export class Scope {
    readonly statements: Statement[];
    readonly startLine: LineCount;

    constructor(statements: Statement[], startLine: LineCount) {
        this.statements = statements;
        this.startLine = startLine;
    }
}
