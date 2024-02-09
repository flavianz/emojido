import { Nodes, Var } from "./types";

export class Generator {
    private readonly program: Nodes.Program;
    private output: string = "global _start\n_start:\n";
    private stackSize: number = 0;
    private vars = new Map<string, Var>();
    private scopes: number[];

    constructor(program: Nodes.Program) {
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

    private beginScope() {
        this.scopes.push(this.vars.size);
    }

    private endScope() {
        const popCount = this.vars.size - this.scopes[-1];
        this.output += `    add rsp, ${popCount * 8}\n`;
        this.stackSize -= popCount;
        let keys = Array.from(this.vars.keys());
        for (let i = 0; i < popCount; i++) {
            keys.pop();
        }
        keys.pop();
        this.vars = new Map(
            [...this.vars.entries()].filter(([key, _value]) =>
                keys.includes(key),
            ),
        );
    }

    private generateScope(scope: Nodes.Scope) {
        this.beginScope();
        for (const statement of scope.statements) {
            this.generateStatement(statement);
        }
        this.endScope();
    }

    private generateTerm(term: Nodes.Term) {
        if (term.type === "intLit") {
            const intLit: Nodes.TermIntLit = term.variant["intLit"];
            this.output += `    mov rax, ${intLit.intLit.value}\n`;
            this.push("rax");
        } else if (term.type === "ident") {
            const ident: Nodes.TermIdent = term.variant["ident"];
            if (!this.vars.has(ident.identifier.value)) {
                throw new Error("Undeclared identifier");
            }
            this.push(
                `QWORD [rsp + ${(this.stackSize - this.vars.get(ident.identifier.value).stackLocation - 1) * 8}]`,
            );
        } else if (term.type === "parens") {
            this.generateExpr(term.variant["expr"]);
        }
    }

    private generateBinaryExpr(binaryExpr: Nodes.BinaryExpr) {
        if (binaryExpr.type === "sub") {
            this.generateExpr(binaryExpr.variant.rhs);
            this.generateExpr(binaryExpr.variant.lhs);
            this.pop("rax");
            this.pop("rbx");
            this.output += "    sub rax, rbx\n";
            this.push("rax");
        } else if (binaryExpr.type === "add") {
            this.generateExpr(binaryExpr.variant.rhs);
            this.generateExpr(binaryExpr.variant.lhs);
            this.pop("rax");
            this.pop("rbx");
            this.output += "    add rax, rbx\n";
            this.push("rax");
        } else if (binaryExpr.type === "mul") {
            this.generateExpr(binaryExpr.variant.rhs);
            this.generateExpr(binaryExpr.variant.lhs);
            this.pop("rax");
            this.pop("rbx");
            this.output += "    mul rbx\n";
            this.push("rax");
        } else if (binaryExpr.type === "div") {
            this.generateExpr(binaryExpr.variant.rhs);
            this.generateExpr(binaryExpr.variant.lhs);
            this.pop("rax");
            this.pop("rbx");
            this.output += "    div rbx\n";
            this.push("rax");
        }
    }

    /** generate the asm for a single expression
     * @param {Nodes.Expr} expr the expr to generate
     * */
    private generateExpr(expr: Nodes.Expr) {
        if (expr.type === "term") {
            //@ts-ignore
            this.generateTerm(expr.variant);
        } else if (expr.type === "binExpr") {
            //@ts-ignore
            this.generateBinaryExpr(expr.variant);
        }
    }

    /**generate the asm for a single statement
     * @param {Nodes.Statement} statement the statement to generate
     * */
    private generateStatement(statement: Nodes.Statement) {
        if (statement.type === "exit") {
            this.generateExpr(statement.variant["expr"]);
            this.output += "    mov rax, 60\n";
            this.pop("rdi");
            this.output += "    syscall\n";
        } else if (statement.type === "let") {
            //check for already assigned variables
            if (this.vars.has(statement.variant["ident"].value)) {
                throw new Error(
                    `Identifier already used: ${statement.variant.value}`,
                );
            }

            this.vars.set(statement.variant.ident.value, {
                stackLocation: this.stackSize,
            });
            this.generateExpr(statement.variant.expr);
        }
    }

    /** Generate asm from the token array
     * @returns {string} the asm
     * */
    generateProgram(): string {
        for (const statement of this.program.statements) {
            this.generateStatement(statement);
        }

        this.output += "    mov rax, 60\n";
        this.output += "    mov rdi, 0\n";
        this.output += "    syscall\n";

        return this.output;
    }
}
