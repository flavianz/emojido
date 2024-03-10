import { LiteralType, Var, VarFunction } from "./types";
import { Program } from "./classes/Program";
import { Scope } from "./classes/Scope";
import {
    Term,
    TermArray,
    TermArrayAccess,
    TermBoolean,
    TermFloat,
    TermIdentifier,
    TermInteger,
    TermMemoryAccess,
    TermNull,
    TermObject,
    TermParens,
    TermParseToFloat,
    TermParseToInt,
    TermPointer,
    TermString,
} from "./classes/Terms";
import {
    BinaryExpression,
    BinaryExpressionAdd,
    BinaryExpressionDiv,
    BinaryExpressionMul,
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
import {
    ElseIfPredicate,
    ElsePredicate,
    IfPredicate,
} from "./classes/IfPredicates";
import { Expression } from "./classes/Expressions";
import {
    Statement,
    StatementAssembly,
    StatementAssign,
    StatementExit,
    StatementFor,
    StatementIf,
    StatementImport,
    StatementLet,
    StatementPrint,
    StatementReturn,
    StatementScope,
    StatementTerm,
    StatementWhile,
} from "./classes/Statements";
import {
    StatementFunctionDefinition,
    TermFunctionCall,
} from "./classes/Functions";
import {
    AssemblyAddToken,
    AssemblyCommentToken,
    AssemblyDivToken,
    AssemblyMovToken,
    AssemblyMulToken,
    AssemblyPopToken,
    AssemblyPushToken,
    AssemblySubToken,
    AssemblyToken,
    AssemblyUnoptimizedToken,
} from "./classes/AssemblyTokens";

export class Generator {
    private readonly program: Program;
    private routines = "\n; routines\n";
    private textTokens: AssemblyToken[] = [];
    private data: string = "";
    private bss: string = "";
    private scopes: {
        vars: Map<string, Var>;
        functions: Map<string, VarFunction>;
        prologStackSize: number;
        stackSize: number;
    }[] = [
        {
            vars: new Map<string, Var>(),
            functions: new Map<string, VarFunction>(),
            prologStackSize: 0,
            stackSize: 0,
        },
    ];
    private labelCount = 0;
    private identCount = 0;

    constructor(program: Program) {
        this.program = program;
    }

    generatePrintInt() {
        if (!this.routines.includes("printInt:")) {
            this.routines += `printInt:
    mov rcx, digitSpace
    mov rbx, 10
    mov [rcx], rbx
    inc rcx
    mov [digitSpacePos], rcx
printIntLoop:
    mov rdx, 0
    mov rbx, 10
    div rbx
    push rax
    add rdx, 48
    mov rcx, [digitSpacePos]
    mov [rcx], dl
    inc rcx
    mov [digitSpacePos], rcx
    pop rax
    cmp rax, 0
    jne printIntLoop
printIntLoop2:
    mov rcx, [digitSpacePos]
    mov rax, 1
    mov rdi, 1
    mov rsi, rcx
    mov rdx, 1
    syscall
    mov rcx, [digitSpacePos]
    dec rcx
    mov [digitSpacePos], rcx
    cmp rcx, digitSpace
    jge printIntLoop2
    ret\n`;
            this.bss += "    digitSpace resb 100\n    digitSpacePos resb 8\n";
        }
    }

    generatePrintBool() {
        if (!this.routines.includes("printBool:")) {
            const true_ = this.generateIdentifier();
            const false_ = this.generateIdentifier();
            this.data += `    ${true_} db "true", 10, 0ah\n    ${false_} db "false", 10, 0ah\n`;
            this.routines += `printBool:
    test rax, rax
    jz printFalse
    jmp printTrue
printFalse:
    mov rsi, ${false_}
    mov rdx, 6
    jmp printBoolEnd
printTrue:
    mov rdx, 5
    mov rsi, ${true_}
printBoolEnd:
    mov rdi, 1
    mov rax, 1
    syscall
    ret
`;
        }
    }

    generateCalcStringLength() {
        if (!this.routines.includes("calc_string_length:")) {
            this.routines += `calc_string_length:
    cmp byte [rsi + rcx], 0ah
    je calc_string_length_return
    inc rcx
    jmp calc_string_length
calc_string_length_return:
    inc rcx
    ret
`;
        }
    }

    generatePushElements() {
        if (!this.routines.includes("push_elements_array:")) {
            this.data +=
                "    array_ptr dq 0\n    array_capacity dq 0\n array_size dq 0\n";
            this.routines += `push_elements_array:
    mov rax, [array_size]
    add rax, rdi
    cmp rax, [array_capacity]
    jle enough_capacity_array
    
    mov rax, [array_capacity]
    shl rax, 1
    mov rcx, rax
    imul rax, rdx, 8
    mov rdi, 0
    mov rdx, rax
    mov r10, 0x22
    mov r8, -1
    mov r9, 0
    syscall
    mov rsi, rax
    mov rax, [array_ptr]
    mov rcx, [array_size]
    shl rcx, 3
    mov rdx, rcx
    mov rdi, rsi
    rep movsq
    
enough_capacity_array:
    add qword [array_capacity], rdi
    ret
    `;
        }
    }

    /**push a register onto the stack and handle stack size
     * @param {string} reg the register to be pushed
     * @param comment
     * */
    private push(reg: string, comment: string = "") {
        this.writeText(new AssemblyPushToken(reg, comment));
        this.scopes[this.scopes.length - 1].stackSize++;
    }

    private pop(reg: string, comment: string = "") {
        this.writeText(new AssemblyPopToken(reg, comment));
        this.scopes[this.scopes.length - 1].stackSize--;
    }

    private writeText(...token: AssemblyToken[]) {
        this.textTokens.push(...token);
    }
    private createLabel() {
        return `label${this.labelCount++}`;
    }

    private generateIdentifier() {
        return `ident${this.identCount++}`;
    }

    private getIdentifierStackOffset(identifier: string) {
        let offset = 0;
        //iterate from behind
        for (let i = 0; i < this.scopes.length; i++) {
            const scope = this.scopes[this.scopes.length - 1 - i];

            if (i !== 0) {
                // mov past all vars, except for active scope
                offset += scope.vars.size;
            }

            if (scope.vars.has(identifier)) {
                //move down to var
                offset -= scope.vars.get(identifier).offsetFromRBP;
                break;
            } else {
                //move offset to rbp of this scope
                offset += scope.prologStackSize;
            }
        }
        return offset;
    }

    private generateScope(scope: Scope, prologStackSize = 1) {
        this.writeText(
            new AssemblyCommentToken(`start scope on line ${scope.startLine}`),
        );
        this.push("rbp");
        this.writeText(new AssemblyMovToken("rbp", "rsp"));

        this.scopes.push({
            vars: new Map(),
            functions: new Map(),
            prologStackSize: prologStackSize,
            stackSize: 0,
        });

        for (const statement of scope.statements) {
            this.generateStatement(statement);
        }

        this.writeText(
            new AssemblyCommentToken(
                `end scope that started on line ${scope.startLine}`,
            ),
        );

        this.scopes.pop();
        this.writeText(new AssemblyMovToken("rsp", "rbp"));
        this.pop("rbp");
    }

    private generateTerm(term: Term) {
        if (term instanceof TermInteger) {
            this.push(
                `${term.integerValue}`,
                `generate term integer ${term.integerValue}`,
            );
        } else if (term instanceof TermFloat) {
            const ident = this.generateIdentifier();
            this.data += `    ${ident} dq ${term.floatValue} ; generate term float ${term.floatValue}\n`; //store value in memory
            this.writeText(new AssemblyMovToken("rax", `[${ident}]`)); //mov float into sse reg
            this.push("rax");
        } else if (term instanceof TermIdentifier) {
            if (term instanceof TermFunctionCall) {
                for (const arg of term.arguments) {
                    this.generateExpr(arg);
                }
                this.writeText(
                    new AssemblyUnoptimizedToken(
                        `    call _${term.identifier}`,
                    ),
                );
                this.writeText(
                    new AssemblyAddToken(
                        "rsp",
                        (term.arguments.length * 8).toString(),
                    ),
                );
                this.push("r14", "push return value to stack");
            } else if (term instanceof TermArrayAccess) {
                this.push(
                    `QWORD [rbp + ${this.getIdentifierStackOffset(term.identifier) * 8}]`,
                    `generate array from identifier ${term.identifier}`,
                );
                this.pop("rdi");
                this.generateExpr(term.expression);
                this.pop("rax");
                this.writeText(new AssemblyMovToken("rbx", "8"));
                this.writeText(new AssemblyMulToken("rbx"));
                this.push("QWORD [rdi + rax]");
            } else {
                // generate identifier
                this.push(
                    `QWORD [rbp + ${this.getIdentifierStackOffset(term.identifier) * 8}]`,
                    `generate term from identifier ${term.identifier}`,
                );
            }
        } else if (term instanceof TermParens) {
            this.generateExpr(term.expression);
        } else if (term instanceof TermBoolean) {
            this.writeText(
                new AssemblyMovToken("rax", term.booleanValue.toString()),
            );
            this.push("rax");
        } else if (term instanceof TermString) {
            const ident = this.generateIdentifier();
            this.data += `    ${ident} db "${term.stringValue}", 10, 0ah\n`;
            this.writeText(new AssemblyMovToken("rax", ident));
            this.push("rax");
        } else if (term instanceof TermNull) {
            this.push("0");
        } else if (term instanceof TermArray) {
            const ident = this.generateIdentifier();
            this.data += `    ${ident}_ptr dq 0\n    ${ident}_capacity dq 0\n    ${ident}_size dq 0\n`;
            this.writeText(
                new AssemblyCommentToken("memory allocation for array"),
            );
            this.writeText(
                new AssemblyUnoptimizedToken(`    mov rdi, 0
    mov rax, 9
    xor rsi, rsi
    mov rdx, 128
    mov r10, 0x22
    mov r8, -1
    mov r9, 0
    syscall
    mov QWORD [${ident}_ptr], rax
    mov QWORD [${ident}_capacity], 16
    
    mov rax, [${ident}_ptr]
    mov [array_ptr], rax
    mov rax, [${ident}_capacity]
    mov [array_capacity], rax
    mov rax, [${ident}_size]
    mov [array_size], rax
    
    mov rdi, ${term.values.length}
    call push_elements_array
    mov qword [${ident}_ptr], rsi
    mov qword [${ident}_capacity], rcx
    `),
            );
            this.generatePushElements();
            for (let i = 0; i < term.values.length; i++) {
                this.generateTerm(term.values[i]);
                this.pop("rax");
                this.writeText(
                    new AssemblyMovToken(
                        `QWORD [${ident}_ptr + ${i * 8}]`,
                        "rax",
                        "set item at index " + i,
                    ),
                );
            }
            this.writeText(
                new AssemblyAddToken(
                    `QWORD [${ident}_size]`,
                    term.values.length.toString(),
                ),
            );
            this.push(ident + "_ptr");
        } else if (term instanceof TermParseToFloat) {
            this.generateExpr(term.expression);
            this.pop("rax");
            this.writeText(
                new AssemblyUnoptimizedToken("    cvtsi2sd xmm0, rax"),
            );
            this.writeText(new AssemblyUnoptimizedToken("    movq rax, xmm0"));
            this.push("rax");
        } else if (term instanceof TermParseToInt) {
            this.generateExpr(term.expression);
            this.pop("rax");
            this.writeText(new AssemblyUnoptimizedToken("    movq xmm0, rax"));
            this.writeText(
                new AssemblyUnoptimizedToken("    cvtsd2si rax, xmm0"),
            );
            this.push("rax");
        } else if (term instanceof TermPointer) {
            const ident = this.generateIdentifier();
            this.generateExpr(term.expressionPointedTo);
            this.data += `    ${ident} dq 0\n`;
            this.pop("rax");
            this.writeText(new AssemblyMovToken(`qword [${ident}]`, "rax"));
            this.push(`${ident}`);
        } else if (term instanceof TermMemoryAccess) {
            this.generateExpr(term.address);
            this.pop("rax");
            this.push("qword [rax]");
        } else if (term instanceof TermObject) {
        }
    }

    private generateNumber(lhs: LiteralType, rhs: LiteralType) {
        if (lhs === LiteralType.integerLiteral) {
            this.writeText(
                new AssemblyUnoptimizedToken("    cvtsi2sd xmm0, rax"),
            );
        } else {
            this.writeText(new AssemblyUnoptimizedToken("    movq xmm0, rax"));
        }
        if (rhs === LiteralType.integerLiteral) {
            this.writeText(
                new AssemblyUnoptimizedToken("    cvtsi2sd xmm1, rbx"),
            );
        } else {
            this.writeText(new AssemblyUnoptimizedToken("    movq xmm1, rbx"));
        }
    }

    private generateBinaryExpr(binaryExpr: BinaryExpression) {
        if (binaryExpr instanceof BinaryExpressionSub) {
            this.writeText(new AssemblyCommentToken("binary subtract"));
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
                this.writeText(new AssemblySubToken("rax", "rbx"));
                this.push("rax");
            } else {
                //min one float involved
                this.generateNumber(
                    binaryExpr.lhsExpression.literalType,
                    binaryExpr.rhsExpression.literalType,
                );

                this.writeText(
                    new AssemblyUnoptimizedToken("    subsd xmm0, xmm1"),
                );
                this.writeText(
                    new AssemblyUnoptimizedToken(`    movq qword rax, xmm0`),
                );
                this.push("rax");
            }
        } else if (binaryExpr instanceof BinaryExpressionAdd) {
            this.writeText(new AssemblyCommentToken("binary add"));
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);

            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            if (
                binaryExpr.lhsExpression.literalType ===
                LiteralType.stringLiteral
            ) {
                //concatenate strings
                //TODO
            } else {
                //add numbers
                if (
                    binaryExpr.lhsExpression.literalType ===
                        LiteralType.integerLiteral &&
                    binaryExpr.rhsExpression.literalType ===
                        LiteralType.integerLiteral
                ) {
                    //sub two integers
                    this.writeText(new AssemblyAddToken("rax", "rbx"));
                    this.push("rax");
                } else {
                    //min one float involved
                    this.generateNumber(
                        binaryExpr.lhsExpression.literalType,
                        binaryExpr.rhsExpression.literalType,
                    );

                    this.writeText(
                        new AssemblyUnoptimizedToken("    addsd xmm0, xmm1"),
                    );
                    this.writeText(
                        new AssemblyUnoptimizedToken(
                            `    movq qword rax, xmm0`,
                        ),
                    );
                    this.push("rax");
                }
            }
        } else if (binaryExpr instanceof BinaryExpressionMul) {
            this.writeText(new AssemblyCommentToken("binary multiply"));
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
                this.writeText(new AssemblyMulToken("rbx"));
                this.push("rax");
            } else {
                //min one float involved
                this.generateNumber(
                    binaryExpr.lhsExpression.literalType,
                    binaryExpr.rhsExpression.literalType,
                );

                this.writeText(
                    new AssemblyUnoptimizedToken("    mulsd xmm0, xmm1"),
                );
                this.writeText(
                    new AssemblyUnoptimizedToken(`    movq qword rax, xmm0`),
                );
                this.push("rax");
            }
        } else if (binaryExpr instanceof BinaryExpressionDiv) {
            this.writeText(new AssemblyCommentToken("binary divide"));
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
                this.writeText(new AssemblyDivToken("rbx"));
                this.push("rax");
            } else {
                //min one float involved
                this.generateNumber(
                    binaryExpr.lhsExpression.literalType,
                    binaryExpr.rhsExpression.literalType,
                );

                this.writeText(
                    new AssemblyUnoptimizedToken("    divsd xmm0, xmm1"),
                );
                this.writeText(
                    new AssemblyUnoptimizedToken(`    movq qword rax, xmm0`),
                );
                this.push("rax");
            }
        } else if (binaryExpr instanceof BooleanBinaryExpressionCompare) {
            this.writeText(new AssemblyCommentToken("binary compare"));
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx");
            this.pop("rax");
            this.writeText(
                new AssemblyUnoptimizedToken(
                    "    cmp rax, rbx\n    setz al\n    movzx rax, al",
                ),
            );
            this.push("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionNotCompare) {
            this.writeText(new AssemblyCommentToken("inversed binary compare"));
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx");
            this.pop("rax");
            this.writeText(
                new AssemblyUnoptimizedToken(
                    "    cmp rax, rbx\n    setnz al\n    movzx rax, al",
                ),
            );
            this.push("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionOr) {
            this.writeText(new AssemblyCommentToken("binary or"));
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            this.writeText(new AssemblyUnoptimizedToken("    or rax, rbx"));
            this.push("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionAnd) {
            this.writeText(new AssemblyCommentToken("binary and"));
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            this.writeText(new AssemblyUnoptimizedToken("    and rax, rbx"));
            this.push("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionXor) {
            this.writeText(new AssemblyCommentToken("binary xor"));
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            this.writeText(new AssemblyUnoptimizedToken("    xor rax, rbx"));
            this.push("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionLessThan) {
            this.writeText(new AssemblyCommentToken("binary '<'"));
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
                this.writeText(
                    new AssemblyUnoptimizedToken(
                        "    cmp rax, rbx\n    setl al\n    movzx rax, al",
                    ),
                );
                this.push("rax");
            } else {
                //min one float involved
                this.generateNumber(
                    binaryExpr.lhsExpression.literalType,
                    binaryExpr.rhsExpression.literalType,
                );

                this.writeText(
                    new AssemblyUnoptimizedToken("    comisd xmm0, xmm1"),
                );
                this.writeText(
                    new AssemblyUnoptimizedToken(
                        "    setb al\n    movzx rax, al",
                    ),
                );
                this.push("rax");
            }
        } else if (binaryExpr instanceof BooleanBinaryExpressionLessEquals) {
            this.writeText(new AssemblyCommentToken("binary '<='"));
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
                this.writeText(
                    new AssemblyUnoptimizedToken(
                        "    cmp rax, rbx\n    setle al\n    movzx rax, al",
                    ),
                );
                this.push("rax");
            } else {
                //min one float involved
                this.generateNumber(
                    binaryExpr.lhsExpression.literalType,
                    binaryExpr.rhsExpression.literalType,
                );

                this.writeText(
                    new AssemblyUnoptimizedToken("    comisd xmm0, xmm1"),
                );
                this.writeText(
                    new AssemblyUnoptimizedToken(
                        "    setbe al\n    movzx rax, al",
                    ),
                );
                this.push("rax");
            }
        } else if (binaryExpr instanceof BooleanBinaryExpressionGreaterThan) {
            this.writeText(new AssemblyCommentToken("binary '>'"));
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
                this.writeText(
                    new AssemblyUnoptimizedToken(
                        "    cmp rax, rbx\n    setg al\n    movzx rax, al",
                    ),
                );
                this.push("rax");
            } else {
                //min one float involved
                this.generateNumber(
                    binaryExpr.lhsExpression.literalType,
                    binaryExpr.rhsExpression.literalType,
                );

                this.writeText(
                    new AssemblyUnoptimizedToken("    comisd xmm0, xmm1"),
                );
                this.writeText(
                    new AssemblyUnoptimizedToken(
                        "    seta al\n    movzx rax, al",
                    ),
                );
                this.push("rax");
            }
        } else if (binaryExpr instanceof BooleanBinaryExpressionGreaterEquals) {
            this.writeText(new AssemblyCommentToken("binary '>='"));
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
                this.writeText(
                    new AssemblyUnoptimizedToken(
                        "    cmp rax, rbx\n    setge al\n    movzx rax, al",
                    ),
                );
                this.push("rax");
            } else {
                //min one float involved
                this.generateNumber(
                    binaryExpr.lhsExpression.literalType,
                    binaryExpr.rhsExpression.literalType,
                );

                this.writeText(
                    new AssemblyUnoptimizedToken("    comisd xmm0, xmm1"),
                );
                this.writeText(
                    new AssemblyUnoptimizedToken(
                        "    setae al\n    movzx rax, al",
                    ),
                );
                this.push("rax");
            }
        }
    }

    private generateIfPredicate(ifPredicate: IfPredicate, endLabel: string) {
        if (ifPredicate instanceof ElseIfPredicate) {
            this.writeText(new AssemblyCommentToken("start elseif statement"));
            this.generateExpr(ifPredicate.expression);
            this.pop("rax");
            const label = this.createLabel();
            this.writeText(
                new AssemblyUnoptimizedToken(
                    `    test rax, rax\n    jz ${label}`,
                ),
            );
            this.generateScope(ifPredicate.scope);
            this.writeText(new AssemblyUnoptimizedToken(`    jmp ${endLabel}`));
            if (ifPredicate.predicate) {
                this.writeText(new AssemblyUnoptimizedToken(`${label}:`));
                this.generateIfPredicate(ifPredicate.predicate, endLabel);
            }
        } else if (ifPredicate instanceof ElsePredicate) {
            this.writeText(new AssemblyCommentToken("start else statement"));
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
            this.writeText(new AssemblyCommentToken("start exit statement"));
            this.generateExpr(statement.expression);
            this.writeText(new AssemblyMovToken("rax", "60"));
            this.pop("rdi");
            this.writeText(new AssemblyUnoptimizedToken("    syscall"));
        } else if (statement instanceof StatementPrint) {
            this.writeText(new AssemblyCommentToken("start print statement"));
            this.generateExpr(statement.expression);
            //check type
            const literalType = statement.expression.literalType;
            if (literalType === LiteralType.stringLiteral) {
                this.writeText(
                    new AssemblyMovToken("rax", "1"),
                    new AssemblyMovToken("rdi", "1"),
                );
                this.pop("rsi");
                this.writeText(
                    new AssemblyUnoptimizedToken(
                        "    xor rcx, rcx\n    call calc_string_length",
                    ),
                );
                this.generateCalcStringLength();
                this.writeText(
                    new AssemblyMovToken("rdx", "rcx"),
                    new AssemblyUnoptimizedToken("    syscall"),
                );
            } else if (literalType === LiteralType.integerLiteral) {
                this.generatePrintInt();
                this.pop("rax");
                this.writeText(
                    new AssemblyUnoptimizedToken("    call printInt"),
                );
            } else if (literalType === LiteralType.booleanLiteral) {
                this.pop("rax");
                this.generatePrintBool();
                this.writeText(
                    new AssemblyUnoptimizedToken("    call printBool"),
                );
            }
        } else if (statement instanceof StatementLet) {
            this.writeText(new AssemblyCommentToken("start let statement"));
            this.scopes[this.scopes.length - 1].vars.set(statement.identifier, {
                offsetFromRBP:
                    this.scopes[this.scopes.length - 1].vars.size + 1,
                type: statement.expression.literalType,
            });
            this.generateExpr(statement.expression);
        } else if (statement instanceof StatementAssign) {
            this.writeText(
                new AssemblyCommentToken("start reassign statement"),
            );
            this.generateExpr(statement.expression);
            this.pop("rax");
            this.writeText(
                new AssemblyMovToken(
                    `[rbp + ${this.getIdentifierStackOffset(statement.identifier) * 8}]`,
                    "rax",
                ),
            );
        } else if (statement instanceof StatementScope) {
            this.generateScope(statement.scope);
        } else if (statement instanceof StatementIf) {
            this.writeText(new AssemblyCommentToken("start if statement"));
            this.generateExpr(statement.expression);
            this.pop("rax");
            const label = this.createLabel();
            this.writeText(
                new AssemblyUnoptimizedToken(
                    `    test rax, rax\n    jz ${label}`,
                ),
            );
            this.generateScope(statement.scope);
            let endLabel: string;
            if (statement.predicate) {
                endLabel = this.createLabel();
                this.writeText(
                    new AssemblyUnoptimizedToken(`    jmp ${endLabel}`),
                );
            }
            this.writeText(new AssemblyUnoptimizedToken(`${label}:`));
            if (statement.predicate) {
                this.generateIfPredicate(statement.predicate, endLabel);
                this.writeText(new AssemblyUnoptimizedToken(`${endLabel}:`));
            }
        } else if (statement instanceof StatementFunctionDefinition) {
            const label = this.createLabel();
            this.writeText(
                new AssemblyCommentToken("start function definition"),
                new AssemblyUnoptimizedToken(
                    `    jmp ${label}\n_${statement.identifier}:`,
                ),
            );
            for (let i = 0; i < statement.arguments.length; i++) {
                const arg = statement.arguments[i];
                //set var dict
                this.scopes[this.scopes.length - 1].vars.set(arg.identifier, {
                    type: arg.type,
                    offsetFromRBP:
                        this.scopes[this.scopes.length - 1].vars.size + 1,
                });
            }
            this.scopes[this.scopes.length - 1].functions.set(
                statement.identifier,
                {
                    arguments: statement.arguments,
                    returnType: statement.returnType,
                    scopeDefinitionOffset:
                        this.scopes[this.scopes.length - 1].stackSize,
                },
            );
            this.generateScope(statement.scope, 2);
            for (const arg of statement.arguments) {
                this.scopes[this.scopes.length - 1].vars.delete(arg.identifier);
            }
            this.writeText(
                new AssemblyUnoptimizedToken("    ret"),
                new AssemblyUnoptimizedToken(`${label}:`),
            );
        } else if (statement instanceof StatementTerm) {
            this.generateTerm(statement.term);
        } else if (statement instanceof StatementReturn) {
            this.generateExpr(statement.expression);
            this.pop("r14", "mov return value into r14");
        } else if (statement instanceof StatementWhile) {
            const startLabel = this.createLabel();
            const endLabel = this.createLabel();
            this.writeText(new AssemblyUnoptimizedToken(`${startLabel}:`));
            this.generateExpr(statement.expression);
            this.pop("rax");
            this.writeText(
                new AssemblyUnoptimizedToken(
                    `    test rax, rax\n    jz ${endLabel}`,
                ),
                new AssemblyCommentToken("while statement scope"),
            );
            this.generateScope(statement.scope);
            this.writeText(
                new AssemblyUnoptimizedToken(
                    `    jmp ${startLabel}\n${endLabel}:`,
                ),
            );
        } else if (statement instanceof StatementFor) {
            this.generateStatement(statement.statementAssign);
            const startLabel = this.createLabel();
            const endLabel = this.createLabel();
            this.writeText(new AssemblyUnoptimizedToken(`${startLabel}:`));
            this.generateExpr(statement.expression);
            this.pop("rax");
            this.writeText(
                new AssemblyUnoptimizedToken(
                    `    test rax, rax\n    jz ${endLabel}`,
                ),
                new AssemblyCommentToken("for statement scope"),
            );
            this.generateScope(statement.scope);
            this.generateStatement(statement.statementModify);
            this.writeText(
                new AssemblyUnoptimizedToken(
                    `    jmp ${startLabel}\n${endLabel}:`,
                ),
            );
            if (statement.statementAssign instanceof StatementLet) {
                this.writeText(new AssemblyAddToken("rsp", "8"));
                this.scopes[this.scopes.length - 1].vars.delete(
                    statement.statementAssign.identifier,
                );
            }
        } else if (statement instanceof StatementImport) {
            for (const var_ of statement.vars) {
                this.generateStatement(var_);
            }
            for (const function_ of statement.functions) {
                this.generateStatement(function_);
            }
        } else if (statement instanceof StatementAssembly) {
            this.writeText(
                new AssemblyUnoptimizedToken(statement.text, "written in code"),
            );
            this.data += statement.data + "\n";
            this.bss += statement.bss + "\n";
        }
    }

    /** Generate asm from the token array
     * */
    generateProgram() {
        this.writeText(new AssemblyMovToken("rbp", "rsp"));
        for (const statement of this.program.statements) {
            this.generateStatement(statement);
        }

        this.writeText(
            new AssemblyMovToken("rax", "60"),
            new AssemblyMovToken("rdi", "0"),
            new AssemblyUnoptimizedToken("    syscall"),
        );

        return {
            data: this.data,
            bss: this.bss,
            text: this.textTokens,
            routines: this.routines,
        };
    }
}
