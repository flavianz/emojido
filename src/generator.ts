import { NodeExpr, NodeProgram, NodeStatement, Var } from "./types";

export class Generator {
    private readonly program: NodeProgram;
    private output: string = "global _start\n_start:\n";
    private stackSize: number = 0;
    private vars = new Map<string, Var>();

    constructor(program: NodeProgram) {
        this.program = program;
    }

    /**push a register onto the stack and handle stack size
     * @param {string} reg the register to be pushed
     * */
    private push(reg: string) {
        this.output += `    push ${reg}\n`;
        this.stackSize++;
    }

    private pop(reg: string) {
        this.output += `    pop ${reg}\n`;
        this.stackSize--;
    }

    /** generate the asm for a single expression
     * @param {NodeExpr} expr the expr to generate
     * */
    private generate_expr(expr: NodeExpr) {
        if (expr.variant.type === "intLit") {
            this.output += `    mov rax, ${expr.variant.intLit.value}\n`;
            this.push("rax");
        } else if (expr.variant.type === "ident") {
            //check if variable exists
            if (!this.vars.has(expr.variant.identifier.value)) {
                throw new Error("Undeclared identifier");
            }

            const _var = this.vars.get(expr.variant.identifier.value);
            this.push(
                `QWORD [rsp + ${(this.stackSize - _var.stackLocation - 1) * 8}]`,
            );
        }
    }

    /**generate the asm for a single statement
     * @param {NodeStatement} statement the statement to generate
     * */
    private generate_statement(statement: NodeStatement) {
        if (statement.variant.type === "exit") {
            this.generate_expr(statement.variant.expr);
            this.output += "    mov rax, 60\n";
            this.pop("rdi");
            this.output += "    syscall\n";
        } else if (statement.variant.type === "let") {
            //check for already assigned variables
            if (this.vars.has(statement.variant.ident.value)) {
                throw new Error(
                    `Identifier already used: ${statement.variant.ident.value}`,
                );
            }

            this.vars.set(statement.variant.ident.value, {
                stackLocation: this.stackSize,
            });
            this.generate_expr(statement.variant.expr);
        }
    }

    /** Generate asm from the token array
     * @returns {string} the asm
     * */
    generate_program(): string {
        for (const statement of this.program.statements) {
            this.generate_statement(statement);
        }

        this.output += "    mov rax, 60\n";
        this.output += "    mov rdi, 0\n";
        this.output += "    syscall\n";

        return this.output;
    }
}
