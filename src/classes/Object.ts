import { StatementLet } from "./Statements";
import { StatementFunctionDefinition } from "./Functions";

export class VariableObject {
    private vars: StatementLet[];
    private functions: StatementFunctionDefinition[];

    constructor(
        vars: StatementLet[],
        functions: StatementFunctionDefinition[],
    ) {
        this.vars = vars;
        this.functions = functions;
    }
}

export class ObjectInteger extends VariableObject {
    readonly a: number;
    constructor() {
        super([], []);
    }
}
