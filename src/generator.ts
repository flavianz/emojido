import { LiteralType, Var } from "./types";
import { Program } from "./classes/Program";
import { Scope } from "./classes/Scope";
import {
    Term,
    TermBoolean,
    TermFloat,
    TermIdentifier,
    TermInteger,
    TermParens,
    TermString,
} from "./classes/Terms";
import {
    BinaryExpression,
    BinaryExpressionAdd,
    BinaryExpressionDiv,
    BinaryExpressionMul,
    BinaryExpressionPow,
    BinaryExpressionSub,
    BooleanBinaryExpressionAnd,
    BooleanBinaryExpressionCompare,
    BooleanBinaryExpressionGreaterEquals,
    BooleanBinaryExpressionGreaterThan,
    BooleanBinaryExpressionLessEquals,
    BooleanBinaryExpressionLessThan,
    BooleanBinaryExpressionNotCompare,
    BooleanBinaryExpressionOr,
    BooleanBinaryExpressionXor,
} from "./classes/BinaryExpressions";
import { checkLiteralType } from "./parser";
import {
    ElseIfPredicate,
    ElsePredicate,
    IfPredicate,
} from "./classes/IfPredicates";
import { Expression } from "./classes/Expressions";
import {
    Statement,
    StatementAssign,
    StatementExit,
    StatementIf,
    StatementLet,
    StatementPrint,
    StatementScope,
} from "./classes/Statements";

export class Generator {
    private readonly program: Program;
    private routines = "\n    ; routines\n";
    private text: string = "";
    private data: string = "";
    private bss: string = "";
    private stackSize: number = 0;
    private vars = new Map<string, Var>();
    private scopes: number[] = [];
    private labelCount = 0;
    private identCount = 0;

    constructor(program: Program) {
        this.program = program;
    }

    generatePrintInt() {
        if (!this.routines.includes("__printInt:")) {
            this.routines += `__printInt:
    mov rcx, _digitSpace
    mov rbx, 10
    mov [rcx], rbx
    inc rcx
    mov [_digitSpacePos], rcx
__printIntLoop:
    mov rdx, 0
    mov rbx, 10
    div rbx
    push rax
    add rdx, 48
    mov rcx, [_digitSpacePos]
    mov [rcx], dl
    inc rcx
    mov [_digitSpacePos], rcx
    pop rax
    cmp rax, 0
    jne __printIntLoop
__printIntLoop2:
    mov rcx, [_digitSpacePos]
    mov rax, 1
    mov rdi, 1
    mov rsi, rcx
    mov rdx, 1
    syscall
    mov rcx, [_digitSpacePos]
    dec rcx
    mov [_digitSpacePos], rcx
    cmp rcx, _digitSpace
    jge __printIntLoop2
    ret\n`;
            this.bss += "    _digitSpace resb 100\n    _digitSpacePos resb 8\n";
        }
    }

    generatePow() {
        if (!this.routines.includes("__pow:")) {
            this.routines += `__pow:
    cmp rbx, 0
    jle __pow_end
    mul rcx
    dec rbx
    jmp __pow
__pow_end:
    ret
`;
        }
    }

    generateCalcStringLength() {
        if (!this.routines.includes("__calc_string_length:")) {
            this.routines += `__calc_string_length:
    cmp byte [rsi + rcx], 0
    je __calc_string_length_return
    inc rcx
    jmp __calc_string_length
__calc_string_length_return:
    ret`;
        }
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

    private generateIdentifier() {
        return `ident${this.identCount++}`;
    }

    private generateScope(scope: Scope) {
        this.text += "    ; start scope\n";
        this.beginScope();
        for (const statement of scope.statements) {
            this.generateStatement(statement);
        }
        this.endScope();
        this.text += "    ; end scope\n";
    }

    private generateTerm(term: Term) {
        if (term instanceof TermInteger) {
            this.text += `    mov rax, ${term.integerValue} ; generate term integer\n`;
            this.push("rax");
        } else if (term instanceof TermFloat) {
            const ident = this.generateIdentifier();
            this.data += `    ${ident} dq ${term.floatValue} ; generate term float\n`; //store value in memory
            this.text += `    mov rax, ${ident}\n`; //mov float into sse reg
            this.push("rax");
        } else if (term instanceof TermIdentifier) {
            this.push(
                `QWORD [rsp + ${(this.stackSize - this.vars.get(term.identifier).stackLocation - 1) * 8}] ; generate term from identifier`,
            );
        } else if (term instanceof TermParens) {
            this.generateExpr(term.expression);
        } else if (term instanceof TermBoolean) {
            this.text += `    mov rax, ${term.booleanValue} ; generate term boolean\n`;
            this.push("rax");
        } else if (term instanceof TermString) {
            const ident = this.generateIdentifier();
            this.data += `    ${ident} db "${term.stringValue}", 0ah\n`;
            this.text += `    mov rax, ${ident} ; generate term string\n`;
            this.push("rax");
        }
    }

    private generateNumber(lhs: LiteralType, rhs: LiteralType): string {
        const ident = this.generateIdentifier();
        this.data += `    ${ident} dq 0\n`;
        if (lhs === LiteralType.integerLiteral) {
            this.text += `    movq xmm0, rax\n`;
        } else {
            this.text += `    movsd xmm0, [rax]\n`;
        }
        if (rhs === LiteralType.integerLiteral) {
            this.text += `    movq xmm1, rbx\n`;
        } else {
            this.text += `    movsd xmm1, [rbx]\n`;
        }
        return ident;
    }

    private generateBinaryExpr(binaryExpr: BinaryExpression) {
        if (binaryExpr instanceof BinaryExpressionSub) {
            this.text += "    ; binary subtract\n";
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);

            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            if (
                binaryExpr.lhsExpression.literalType ===
                    LiteralType.integerLiteral &&
                binaryExpr.rhsExpression.literalType ===
                    LiteralType.integerLiteral
            ) {
                //sub two integers
                this.text += "    sub rax, rbx\n";
                this.push("rax");
            } else {
                //min one float involved
                const ident = this.generateNumber(
                    binaryExpr.lhsExpression.literalType,
                    binaryExpr.rhsExpression.literalType,
                );

                this.text += "    subsd xmm0, xmm1\n";
                this.text += `    movq qword [${ident}], xmm0\n`;
                this.text += `    mov rax, [${ident}]\n`;
                this.push("rax");
            }
        } else if (binaryExpr instanceof BinaryExpressionAdd) {
            this.text += "    ; binary add\n";
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);

            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            if (
                binaryExpr.lhsExpression.literalType ===
                    LiteralType.integerLiteral &&
                binaryExpr.rhsExpression.literalType ===
                    LiteralType.integerLiteral
            ) {
                //sub two integers
                this.text += "    add rax, rbx\n";
                this.push("rax");
            } else {
                //min one float involved
                const ident = this.generateNumber(
                    binaryExpr.lhsExpression.literalType,
                    binaryExpr.rhsExpression.literalType,
                );

                this.text += "    addsd xmm0, xmm1\n";
                this.text += `    movq qword [${ident}], xmm0\n`;
                this.text += `    mov rax, [${ident}]\n`;
                this.push("rax");
            }
        } else if (binaryExpr instanceof BinaryExpressionMul) {
            this.text += "    ; binary multiply\n";
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);

            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            if (
                binaryExpr.lhsExpression.literalType ===
                    LiteralType.integerLiteral &&
                binaryExpr.rhsExpression.literalType ===
                    LiteralType.integerLiteral
            ) {
                //sub two integers
                this.text += "    mul rbx\n";
                this.push("rax");
            } else {
                //min one float involved
                const ident = this.generateNumber(
                    binaryExpr.lhsExpression.literalType,
                    binaryExpr.rhsExpression.literalType,
                );

                this.text += "    mulsd xmm0, xmm1\n";
                this.text += `    movq qword [${ident}], xmm0\n`;
                this.text += `    mov rax, [${ident}]\n`;
                this.push("rax");
            }
        } else if (binaryExpr instanceof BinaryExpressionDiv) {
            this.text += "    ; binary divide\n";
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);

            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            if (
                binaryExpr.lhsExpression.literalType ===
                    LiteralType.integerLiteral &&
                binaryExpr.rhsExpression.literalType ===
                    LiteralType.integerLiteral
            ) {
                //sub two integers
                this.text += "    div rbx\n";
                this.push("rax");
            } else {
                //min one float involved
                const ident = this.generateNumber(
                    binaryExpr.lhsExpression.literalType,
                    binaryExpr.rhsExpression.literalType,
                );

                this.text += "    divsd xmm0, xmm1\n";
                this.text += `    movq qword [${ident}], xmm0\n`;
                this.text += `    mov rax, [${ident}]\n`;
                this.push("rax");
            }
        } else if (binaryExpr instanceof BinaryExpressionPow) {
            this.text += "    ; binary pow\n";
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            checkLiteralType(
                binaryExpr.lhsExpression.literalType,
                [LiteralType.integerLiteral, LiteralType.floatLiteral],
                binaryExpr.line,
            );

            this.pop("rbx"); //Exponent
            this.pop("rcx"); //Base
            this.text += "    mov rax, 1\n    call __pow\n";
            this.generatePow();
            this.push("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionCompare) {
            this.text += "    ; binary compare\n";
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx");
            this.pop("rax");
            this.text += "    cmp rax, rbx\n    setz al\n";
            this.pop("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionNotCompare) {
            this.text += "    ; binary not compare\n";
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx");
            this.pop("rax");
            this.text += "    cmp rax, rbx\n    setnz al\n";
            this.pop("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionOr) {
            this.text += "    ; binary or\n";
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            this.text += "    or rax, rbx\n";
            this.push("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionAnd) {
            this.text += "    ; binary and\n";
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            this.text += "    and rax, rbx\n";
            this.push("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionXor) {
            this.text += "    ; binary xor\n";
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            this.text += "    xor rax, rbx\n";
            this.push("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionLessThan) {
            this.text += "    ; binary '<'\n";
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            this.text += "    cmp rax, rbx\n    setl al\n";
            this.push("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionLessEquals) {
            this.text += "    ; binary '<='\n";
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            this.text += "    cmp rax, rbx\n    setle al\n";
            this.push("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionGreaterThan) {
            this.text += "    ; binary '>'\n";
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            this.text += "    cmp rax, rbx\n    setg al\n";
            this.push("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionGreaterEquals) {
            this.text += "    ; binary '>='\n";
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            this.text += "    cmp rax, rbx\n    setge al\n";
            this.push("rax");
        }
    }

    private generateIfPredicate(ifPredicate: IfPredicate, endLabel: string) {
        if (ifPredicate instanceof ElseIfPredicate) {
            this.text += "    ; start elseif statement\n";
            this.generateExpr(ifPredicate.expression);
            this.pop("rax");
            const label = this.createLabel();
            this.text += `    test rax, rax\n    jz ${label}\n`;
            this.generateScope(ifPredicate.scope);
            this.text += `    jmp ${endLabel}\n`;
            if (ifPredicate.predicate) {
                this.text += `${label}:\n`;
                this.generateIfPredicate(ifPredicate.predicate, endLabel);
            }
        } else if (ifPredicate instanceof ElsePredicate) {
            this.text += "    ; start else statement\n";
            this.generateScope(ifPredicate.scope);
        }
    }

    /** generate the asm for a single expression
     * @param {Expression} expr the expr to generate
     * */
    private generateExpr(expr: Expression) {
        if (expr instanceof Term) {
            this.generateTerm(expr);
        } else if (expr instanceof BinaryExpression) {
            this.generateBinaryExpr(expr);
        }
    }

    /**generate the asm for a single statement
     * @param {Statement} statement the statement to generate
     * */
    private generateStatement(statement: Statement) {
        if (statement instanceof StatementExit) {
            this.text += "    ; start exit statement\n";
            this.generateExpr(statement.expression);
            this.text += "    mov rax, 60\n";
            this.pop("rdi");
            this.text += "    syscall\n";
        } else if (statement instanceof StatementPrint) {
            this.text += "    ; start print statement\n";
            this.generateExpr(statement.expression);
            //check type
            let literalType: LiteralType;
            if (statement.expression instanceof TermIdentifier) {
                literalType = this.vars.get(
                    statement.expression.identifier,
                ).type;
            } else {
                literalType = statement.expression.literalType;
            }
            if (literalType === LiteralType.stringLiteral) {
                this.text += "    mov rax, 1\n    mov rdi, 1\n";
                this.pop("rsi");
                this.text +=
                    "    xor rcx, rcx\n    call __calc_string_length\n";
                this.generateCalcStringLength();
                this.text += "    mov rdx, rcx\n    syscall\n";
            } else if (literalType === LiteralType.integerLiteral) {
                this.generatePrintInt();
                this.text += "    pop rax\n    call __printInt\n";
            }
        } else if (statement instanceof StatementLet) {
            this.text += "    ; start let statement\n";
            this.vars.set(statement.identifier, {
                stackLocation: this.stackSize,
                type: statement.expression.literalType,
            });
            this.generateExpr(statement.expression);
        } else if (statement instanceof StatementAssign) {
            this.text += "    ; start reassign statement\n";
            this.generateExpr(statement.expression);
            const var_ = this.vars.get(statement.identifier);
            this.pop("rax");
            this.text += `    mov [rsp + ${(this.stackSize - var_.stackLocation - 1) * 8}], rax\n`;
        } else if (statement instanceof StatementScope) {
            this.generateScope(statement.scope);
        } else if (statement instanceof StatementIf) {
            this.text += "    ; start if statement\n";
            this.generateExpr(statement.expression);
            this.pop("rax");
            const label = this.createLabel();
            this.text += `    test rax, rax\n    jz ${label}\n`;
            this.generateScope(statement.scope);
            let endLabel: string;
            if (statement.predicate) {
                endLabel = this.createLabel();
                this.text += `    jmp ${endLabel}\n`;
            }
            this.text += `${label}:\n`;
            if (statement.predicate) {
                this.generateIfPredicate(statement.predicate, endLabel);
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
            "section .bss\n" +
            this.bss +
            "\nsection .text\n    global _start\n_start:\n" +
            this.text +
            this.routines
        );
    }
}
