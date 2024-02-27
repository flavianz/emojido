import { StatementLet } from "./Statements";
import { StatementFunctionDefinition } from "./Functions";

export interface VariableObject {
    vars: Map<string, StatementLet>;
    functions: Map<string, StatementFunctionDefinition>;
}
