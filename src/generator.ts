import { Nodes, Var } from "./types";

export class Generator {
    private readonly program: Nodes.Program;
    private text: string = "";
    private data: string = "";
    private bss: string = "";
    private stackSize: number = 0;
    private vars = new Map<string, Var>();
    private scopes: number[] = [];
    private labelCount = 0;
    private identCount = 0;

    constructor(program: Nodes.Program) {
        this.program = program;
    }

    /**push a register onto the stack and handle stack size
     * @param {string} reg the register to be pushed
     * */
    private push(reg: string) {
        this.text += `    push ${reg}\n`;
        this.stackSize++;
    }

    private pop(reg: string) {
        this.text += `    pop ${reg}\n`;
        this.stackSize--;
    }

    private beginScope() {
        this.scopes.push(this.vars.size);
    }

    private endScope() {
        const popCount = this.vars.size - this.scopes[this.scopes.length - 1];
        this.text += `    add rsp, ${popCount * 8}\n`;
        this.stackSize -= popCount;
        let keys = Array.from(this.vars.keys());
        for (let i = 0; i < popCount; i++) {
            keys.pop();
        }
        this.vars = new Map(
            [...this.vars.entries()].filter(([key, _value]) =>
                keys.includes(key),
            ),
        );
    }

    private createLabel() {
        return `label${this.labelCount++}`;
    }

    private error(error: string, line: number) {
        throw new Error(`[Parse Error]: ${error} on line ${line ?? "unknown"}`);
    }

    private generateIdentifier() {
        return `ident${this.identCount++}`;
    }

    private generateScope(scope: Nodes.Scope) {
        this.beginScope();
        for (const statement of scope.statements) {
            this.generateStatement(statement);
        }
        this.endScope();
    }

    private generateTerm(term: Nodes.Term): "int" | "bool" | "string" {
        if (term.type === "intLit") {
            //@ts-ignore
            this.text += `    mov rax, ${term.variant.intLit.value}\n`;
            this.push("rax");
            return "int";
        } else if (term.type === "ident") {
            //@ts-ignore
            const value = term.variant.ident.value;
            if (!this.vars.has(value)) {
                //@ts-ignore
                this.error("Undeclared identifier", term.variant.ident.line);
            }

            this.push(
                `QWORD [rsp + ${(this.stackSize - this.vars.get(value).stackLocation - 1) * 8}]`,
            );
            return this.vars.get(value).type;
        } else if (term.type === "parens") {
            return this.generateExpr(term.variant["expr"]);
        } else if (term.type === "boolLit") {
            //@ts-ignore
            this.text += `    mov rax, ${term.variant.bool.value}\n`;
            this.push("rax");
            return "bool";
        } else if (term.type === "string") {
            //@ts-ignore
            const string: Nodes.TermString = term.variant;
            const ident = this.generateIdentifier();
            this.data += `    ${ident} db "${string.string.value}", 0ah\n`;
            this.text += `    mov rax, ${ident}\n`;
            this.push("rax");
            return "string";
        }
    }

    private generateBinaryExpr(binaryExpr: Nodes.BinaryExpr): "int" | "bool" {
        if (binaryExpr.type === "sub") {
            const typeRhs = this.generateExpr(binaryExpr.variant.rhs);
            const typeLhs = this.generateExpr(binaryExpr.variant.lhs);
            if (typeRhs !== typeLhs || typeRhs !== "int") {
                this.error("Expected type '🧮'", undefined);
            }
            this.pop("rax");
            this.pop("rbx");
            this.text += "    sub rax, rbx\n";
            this.push("rax");
            return "int";
        } else if (binaryExpr.type === "add") {
            const typeRhs = this.generateExpr(binaryExpr.variant.rhs);
            const typeLhs = this.generateExpr(binaryExpr.variant.lhs);
            if (typeRhs !== typeLhs || typeRhs !== "int") {
                this.error("Expected type '🧮'", undefined);
            }
            this.pop("rax");
            this.pop("rbx");
            this.text += "    add rax, rbx\n";
            this.push("rax");
            return "int";
        } else if (binaryExpr.type === "mul") {
            const typeRhs = this.generateExpr(binaryExpr.variant.rhs);
            const typeLhs = this.generateExpr(binaryExpr.variant.lhs);
            if (typeRhs !== typeLhs || typeRhs !== "int") {
                this.error("Expected type '🧮'", undefined);
            }
            this.pop("rax");
            this.pop("rbx");
            this.text += "    mul rbx\n";
            this.push("rax");
            return "int";
        } else if (binaryExpr.type === "div") {
            const typeRhs = this.generateExpr(binaryExpr.variant.rhs);
            const typeLhs = this.generateExpr(binaryExpr.variant.lhs);
            if (typeRhs !== typeLhs || typeRhs !== "int") {
                this.error("Expected type '🧮'", undefined);
            }
            this.pop("rax");
            this.pop("rbx");
            this.text += "    xor rdx, rdx\n    div rbx\n";
            this.push("rax");
            return "int";
        } else if (binaryExpr.type === "comp") {
            const typeRhs = this.generateExpr(binaryExpr.variant.rhs);
            const typeLhs = this.generateExpr(binaryExpr.variant.lhs);
            if (typeRhs !== typeLhs) {
                this.error(
                    "Expected type same type on both sides of comparison",
                    undefined,
                );
            }
            this.pop("rax");
            this.pop("rbx");
            this.text += "    cmp rax, rbx\n    setz al\n";
            this.push("rax");
            return "bool";
        } else if (binaryExpr.type === "notComp") {
            const typeRhs = this.generateExpr(binaryExpr.variant.rhs);
            const typeLhs = this.generateExpr(binaryExpr.variant.lhs);
            if (typeRhs !== typeLhs) {
                this.error(
                    "Expected type same type on both sides of comparison",
                    undefined,
                );
            }
            this.pop("rax");
            this.pop("rbx");
            this.text += "    cmp rax, rbx\n    setnz al\n";
            this.push("rax");
            return "bool";
        } else if (binaryExpr.type === "or") {
            const typeRhs = this.generateExpr(binaryExpr.variant.rhs);
            const typeLhs = this.generateExpr(binaryExpr.variant.lhs);
            if (typeRhs !== typeLhs || typeRhs !== "bool") {
                this.error("Expected type '⚜️'", undefined);
            }
            this.pop("rax");
            this.pop("rbx");
            this.text += "    or rax, rbx\n";
            this.push("rax");
            return "bool";
        } else if (binaryExpr.type === "and") {
            const typeRhs = this.generateExpr(binaryExpr.variant.rhs);
            const typeLhs = this.generateExpr(binaryExpr.variant.lhs);
            if (typeRhs !== typeLhs || typeRhs !== "bool") {
                this.error("Expected type '⚜️'", undefined);
            }
            this.pop("rax");
            this.pop("rbx");
            this.text += "    and rax, rbx\n";
            this.push("rax");
            return "bool";
        } else if (binaryExpr.type === "xor") {
            const typeRhs = this.generateExpr(binaryExpr.variant.rhs);
            const typeLhs = this.generateExpr(binaryExpr.variant.lhs);
            if (typeRhs !== typeLhs || typeRhs !== "bool") {
                this.error("Expected type '⚜️'", undefined);
            }
            this.pop("rax");
            this.pop("rbx");
            this.text += "    xor rax, rbx\n";
            this.push("rax");
            return "bool";
        } else if (binaryExpr.type === "smaller") {
            const typeRhs = this.generateExpr(binaryExpr.variant.rhs);
            const typeLhs = this.generateExpr(binaryExpr.variant.lhs);
            if (typeRhs !== typeLhs || typeRhs !== "int") {
                this.error("Expected type '🧮'", undefined);
            }
            this.pop("rax");
            this.pop("rbx");
            this.text += "    cmp rax, rbx\n    setl al\n";
            this.push("rax");
            return "bool";
        } else if (binaryExpr.type === "smallerEquals") {
            const typeRhs = this.generateExpr(binaryExpr.variant.rhs);
            const typeLhs = this.generateExpr(binaryExpr.variant.lhs);
            if (typeRhs !== typeLhs || typeRhs !== "int") {
                this.error("Expected type '🧮'", undefined);
            }
            this.pop("rax");
            this.pop("rbx");
            this.text += "    cmp rax, rbx\n    setle al\n";
            this.push("rax");
            return "bool";
        } else if (binaryExpr.type === "grater") {
            const typeRhs = this.generateExpr(binaryExpr.variant.rhs);
            const typeLhs = this.generateExpr(binaryExpr.variant.lhs);
            if (typeRhs !== typeLhs || typeRhs !== "int") {
                this.error("Expected type '🧮'", undefined);
            }
            this.pop("rax");
            this.pop("rbx");
            this.text += "    cmp rax, rbx\n    setg al\n";
            this.push("rax");
            return "bool";
        } else if (binaryExpr.type === "greaterEquals") {
            const typeRhs = this.generateExpr(binaryExpr.variant.rhs);
            const typeLhs = this.generateExpr(binaryExpr.variant.lhs);
            if (typeRhs !== typeLhs || typeRhs !== "int") {
                this.error("Expected type '🧮'", undefined);
            }
            this.pop("rax");
            this.pop("rbx");
            this.text += "    cmp rax, rbx\n    setge al\n";
            this.push("rax");
            return "bool";
        }
    }

    private generateIfPredicate(
        ifPredicate: Nodes.IfPredicate,
        endLabel: string,
    ) {
        if (ifPredicate.type === "elseIf") {
            //@ts-ignore
            const elif: Nodes.ElseIf = ifPredicate.variant;

            const type = this.generateExpr(elif.expr);
            if (type !== "bool") {
                this.error("Expected type '⚜️'", undefined);
            }
            this.pop("rax");
            const label = this.createLabel();
            this.text += `    test rax, rax\n    jz ${label}\n`;
            this.generateScope(elif.scope);
            this.text += `    jmp ${endLabel}\n`;
            if (elif.predicate) {
                this.text += `${label}:\n`;
                this.generateIfPredicate(elif.predicate, endLabel);
            }
        } else if (ifPredicate.type === "else") {
            //@ts-ignore
            const else_: Nodes.Else = ifPredicate.variant;
            this.generateScope(else_.scope);
        }
    }

    /** generate the asm for a single expression
     * @param {Nodes.Expr} expr the expr to generate
     * */
    private generateExpr(expr: Nodes.Expr): "int" | "bool" | "string" {
        if (expr.type === "term") {
            //@ts-ignore
            return this.generateTerm(expr.variant);
        } else if (expr.type === "binExpr") {
            //@ts-ignore
            return this.generateBinaryExpr(expr.variant);
        }
    }

    /**generate the asm for a single statement
     * @param {Nodes.Statement} statement the statement to generate
     * */
    private generateStatement(statement: Nodes.Statement) {
        if (statement.type === "exit") {
            const type = this.generateExpr(statement.variant["expr"]);
            if (type !== "int") {
                this.error("Expected type '🧮'", undefined);
            }
            this.text += "    mov rax, 60\n";
            this.pop("rdi");
            this.text += "    syscall\n";
        } else if (statement.type === "print") {
            const type = this.generateExpr(statement.variant["expr"]);
            if (type !== "string") {
                this.error("Expected type string", undefined);
            }
            this.text += "    mov rax, 1\n    mov rdi, 1\n";
            this.pop("rsi");
            this.text +=
                "    xor rcx, rcx\n__calc_length_loop:\n" +
                "    cmp byte [rsi + rcx], 0\n    je __calc_length_done\n" +
                "    inc rcx\n    jmp __calc_length_loop\n__calc_length_done:\n" +
                "    mov rdx, rcx\n    syscall\n";
        } else if (statement.type === "let") {
            //check for already assigned variables
            const ident = statement.variant["ident"];
            if (this.vars.has(ident.value)) {
                this.error(
                    `Identifier ${ident.value} already used`,
                    statement.variant["ident"].line,
                );
            }
            const stackSize = this.stackSize;
            const type = this.generateExpr(statement.variant["expr"]);
            this.vars.set(ident.value, {
                stackLocation: stackSize,
                type: type,
            });
        } else if (statement.type === "assign") {
            //@ts-ignore
            const assign: Nodes.StatementAssign = statement.variant;
            if (!this.vars.has(assign.ident.value)) {
                this.error(
                    `Undeclared identifier '${assign.ident.value}'`,
                    assign.ident.line,
                );
            }
            const type = this.generateExpr(assign.expr);
            const var_ = this.vars.get(assign.ident.value);
            if (type !== var_.type) {
                this.error(
                    `Expected type '${{ bool: "⚜️", int: "🧮" }[var_.type]}'`,
                    undefined,
                );
            }
            this.pop("rax");
            this.text += `    mov [rsp + ${(this.stackSize - var_.stackLocation - 1) * 8}], rax\n`;
        } else if (statement.type === "scope") {
            this.generateScope(statement.variant["scope"]);
        } else if (statement.type === "if") {
            //@ts-ignore
            const statementIf: Nodes.StatementIf = statement.variant;
            const type = this.generateExpr(statementIf.expr);
            if (type !== "bool") {
                this.error("Expected type '⚜️'", undefined);
            }
            this.pop("rax");
            //if the test is false, we jump to the label created after generating the scope
            const label = this.createLabel();
            this.text += `    test rax, rax\n    jz ${label}\n`;
            this.generateScope(statementIf.scope);
            let endLabel: string;
            if (statementIf.predicate) {
                endLabel = this.createLabel();
                this.text += `    jmp ${endLabel}\n`;
            }
            this.text += `${label}:\n`;
            if (statementIf.predicate) {
                this.generateIfPredicate(statementIf.predicate, endLabel);
                this.text += `${endLabel}:\n`;
            }
        }
    }

    /** Generate asm from the token array
     * @returns {string} the asm
     * */
    generateProgram(): string {
        for (const statement of this.program.statements) {
            this.generateStatement(statement);
        }

        this.text += "    mov rax, 60\n";
        this.text += "    mov rdi, 0\n";
        this.text += "    syscall\n";

        return (
            "section .data\n" +
            this.data +
            "section .bss" +
            this.bss +
            "\nsection .text\n    global _start\n_start:\n" +
            this.text
        );
    }
}
