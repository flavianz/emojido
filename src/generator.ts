import { LiteralType, Var } from "./types";
import { Program } from "./classes/Program";
import { Scope } from "./classes/Scope";
import {
    Term,
    TermBoolean,
    TermFloat,
    TermIdentifier,
    TermInteger,
    TermNull,
    TermParens,
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
    StatementAssign,
    StatementExit,
    StatementIf,
    StatementLet,
    StatementPrint,
    StatementReturn,
    StatementScope,
    StatementTerm,
} from "./classes/Statements";
import {
    TermFunctionCall,
    StatementFunctionDefinition,
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
    private routines = "\n    ; routines\n";
    private textTokens: AssemblyToken[] = [];
    private data: string = "";
    private bss: string = "";
    private stackSize: number = 0;
    private vars = new Map<string, Var>();
    private functions = new Map<string, StatementFunctionDefinition>();
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

    generateCalcStringLength() {
        if (!this.routines.includes("__calc_string_length:")) {
            this.routines += `__calc_string_length:
    cmp byte [rsi + rcx], 0ah
    je __calc_string_length_return
    inc rcx
    jmp __calc_string_length
__calc_string_length_return:
    inc rcx
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
        this.stackSize++;
    }

    private pop(reg: string, comment: string = "") {
        this.writeText(new AssemblyPopToken(reg, comment));
        this.stackSize--;
    }

    private writeText(...token: AssemblyToken[]) {
        this.textTokens.push(...token);
    }

    private beginScope() {
        this.scopes.push(this.vars.size);
    }

    private endScope(isFunction = false) {
        const varPopCount =
            this.vars.size - this.scopes[this.scopes.length - 1];
        if (!isFunction) {
            this.writeText(
                new AssemblyAddToken(
                    "rsp",
                    (varPopCount * 8).toString(),
                    "move stack pointer up for each var in scope",
                ),
            );
        }
        this.stackSize -= varPopCount;
        let keys = Array.from(this.vars.keys());
        for (let i = 0; i < varPopCount; i++) {
            keys.pop();
        }
        this.vars = new Map(
            [...this.vars.entries()].filter(([key, _value]) =>
                keys.includes(key),
            ),
        );
        if (!isFunction) {
            this.scopes.pop();
        }
    }

    private createLabel() {
        return `label${this.labelCount++}`;
    }

    private generateIdentifier() {
        return `ident${this.identCount++}`;
    }

    private generateScope(scope: Scope, isFunction = false) {
        this.writeText(
            new AssemblyCommentToken(`start scope on line ${scope.startLine}`),
        );
        this.beginScope();
        for (const statement of scope.statements) {
            this.generateStatement(statement);
        }
        this.endScope(isFunction);
        this.writeText(
            new AssemblyCommentToken(
                `end scope that started on line ${scope.startLine}`,
            ),
        );
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
            this.writeText(new AssemblyMovToken("rax", ident)); //mov float into sse reg
            this.push("rax");
        } else if (term instanceof TermIdentifier) {
            if (term instanceof TermFunctionCall) {
                for (const arg of term.arguments) {
                    this.generateExpr(arg);
                }
                this.writeText(
                    new AssemblyUnoptimizedToken(
                        `    call _${term.identifier}`,
                        `call function ${term.identifier}`,
                    ),
                    new AssemblyAddToken(
                        "rsp",
                        (term.arguments.length * 8).toString(),
                        "move stack pointer up for each arg in function",
                    ),
                );
                this.scopes.pop();
                this.stackSize -= term.arguments.length;
                this.push("rax", "push return value of function to stack");
            } else {
                this.push(
                    `QWORD [rsp + ${
                        (this.stackSize -
                            this.vars.get(term.identifier).stackLocation -
                            1) *
                        8
                    }]`,
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
            this.data += `    ${ident} db "${term.stringValue}", 0ah\n`;
            this.writeText(new AssemblyMovToken("rax", ident));
            this.push("rax");
        } else if (term instanceof TermNull) {
            this.push("0");
        }
    }

    private generateNumber(lhs: LiteralType, rhs: LiteralType): string {
        const ident = this.generateIdentifier();
        this.data += `    ${ident} dq 0\n`;
        if (lhs === LiteralType.integerLiteral) {
            this.writeText(new AssemblyUnoptimizedToken("    movq xmm0, rax"));
        } else {
            this.writeText(
                new AssemblyUnoptimizedToken("    movsd xmm0, [rax]"),
            );
        }
        if (rhs === LiteralType.integerLiteral) {
            this.writeText(new AssemblyUnoptimizedToken("    movq xmm1, rbx"));
        } else {
            this.writeText(
                new AssemblyUnoptimizedToken("    movsd xmm1, [rbx]"),
            );
        }
        return ident;
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
                const ident = this.generateNumber(
                    binaryExpr.lhsExpression.literalType,
                    binaryExpr.rhsExpression.literalType,
                );

                this.writeText(
                    new AssemblyUnoptimizedToken("    subsd xmm0, xmm1"),
                );
                this.writeText(
                    new AssemblyUnoptimizedToken(
                        `    movq qword [${ident}], xmm0`,
                    ),
                );
                this.writeText(new AssemblyMovToken("rax", `[${ident}]`));
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
                    LiteralType.integerLiteral &&
                binaryExpr.rhsExpression.literalType ===
                    LiteralType.integerLiteral
            ) {
                //sub two integers
                this.writeText(new AssemblyAddToken("rax", "rbx"));
                this.push("rax");
            } else {
                //min one float involved
                const ident = this.generateNumber(
                    binaryExpr.lhsExpression.literalType,
                    binaryExpr.rhsExpression.literalType,
                );

                this.writeText(
                    new AssemblyUnoptimizedToken("    addsd xmm0, xmm1"),
                );
                this.writeText(
                    new AssemblyUnoptimizedToken(
                        `    movq qword [${ident}], xmm0`,
                    ),
                );
                this.writeText(new AssemblyMovToken("rax", `[${ident}]`));
                this.push("rax");
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
                const ident = this.generateNumber(
                    binaryExpr.lhsExpression.literalType,
                    binaryExpr.rhsExpression.literalType,
                );

                this.writeText(
                    new AssemblyUnoptimizedToken("    mulsd xmm0, xmm1"),
                );
                this.writeText(
                    new AssemblyUnoptimizedToken(
                        `    movq qword [${ident}], xmm0`,
                    ),
                );
                this.writeText(new AssemblyMovToken("rax", `[${ident}]`));
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
                const ident = this.generateNumber(
                    binaryExpr.lhsExpression.literalType,
                    binaryExpr.rhsExpression.literalType,
                );

                this.writeText(
                    new AssemblyUnoptimizedToken("    divsd xmm0, xmm1"),
                );
                this.writeText(
                    new AssemblyUnoptimizedToken(
                        `    movq qword [${ident}], xmm0`,
                    ),
                );
                this.writeText(new AssemblyMovToken("rax", `[${ident}]`));
                this.push("rax");
            }
        } else if (binaryExpr instanceof BooleanBinaryExpressionCompare) {
            this.writeText(new AssemblyCommentToken("binary compare"));
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx");
            this.pop("rax");
            this.writeText(
                new AssemblyUnoptimizedToken("    cmp rax, rbx\n    setz al"),
            );
            this.push("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionNotCompare) {
            this.writeText(new AssemblyCommentToken("inversed binary compare"));
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx");
            this.pop("rax");
            this.writeText(
                new AssemblyUnoptimizedToken("    cmp rax, rbx\n    setnz al"),
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
            this.writeText(
                new AssemblyUnoptimizedToken("    cmp rax, rbx\n    setl al"),
            );
            this.push("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionLessEquals) {
            this.writeText(new AssemblyCommentToken("binary '<='"));
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            this.writeText(
                new AssemblyUnoptimizedToken("    cmp rax, rbx\n    setle al"),
            );
            this.push("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionGreaterThan) {
            this.writeText(new AssemblyCommentToken("binary '>'"));
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            this.writeText(
                new AssemblyUnoptimizedToken("    cmp rax, rbx\n    setg al"),
            );
            this.push("rax");
        } else if (binaryExpr instanceof BooleanBinaryExpressionGreaterEquals) {
            this.writeText(new AssemblyCommentToken("binary '>='"));
            this.generateExpr(binaryExpr.lhsExpression);
            this.generateExpr(binaryExpr.rhsExpression);
            this.pop("rbx"); //Rhs
            this.pop("rax"); //Lhs
            this.writeText(
                new AssemblyUnoptimizedToken("    cmp rax, rbx\n    setge al"),
            );
            this.push("rax");
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
                        "    xor rcx, rcx\n    call __calc_string_length",
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
                    new AssemblyUnoptimizedToken("    call __printInt"),
                );
            }
        } else if (statement instanceof StatementLet) {
            this.writeText(new AssemblyCommentToken("start let statement"));
            this.vars.set(statement.identifier, {
                stackLocation: this.stackSize,
                type: statement.expression.literalType,
            });
            this.generateExpr(statement.expression);
        } else if (statement instanceof StatementAssign) {
            this.writeText(
                new AssemblyCommentToken("start reassign statement"),
            );
            this.generateExpr(statement.expression);
            const var_ = this.vars.get(statement.identifier);
            this.pop("rax");
            this.writeText(
                new AssemblyMovToken(
                    `[rsp + ${(this.stackSize - var_.stackLocation - 1) * 8}]`,
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
            const label = this.createLabel(); //end of function label
            this.writeText(
                new AssemblyCommentToken("start function definition"),
                new AssemblyUnoptimizedToken(
                    `    jmp ${label}\n_${statement.identifier}:`,
                ),
            );
            for (let i = 0; i < statement.arguments.length; i++) {
                //add arguments to the var map from behind because they are already in the stack
                const arg =
                    statement.arguments[statement.arguments.length - 1 - i];
                this.vars.set(arg.identifier, {
                    stackLocation: this.stackSize - 1 - i,
                    type: arg.type,
                });
            }
            this.functions.set(statement.identifier, statement);
            this.stackSize++; // "call" instruction pushed return address onto stack
            this.generateScope(statement.scope, true);
            const functionDepth = statement.scope.innerScopeDepth;
            let varPopCount =
                this.vars.size - this.scopes[this.scopes.length - 1];
            for (let i = this.scopes.length - 1; functionDepth <= i; i--) {
                varPopCount += this.scopes[i] - this.scopes[i - 1];
            }
            this.stackSize -= varPopCount;
            this.stackSize--; //"ret" instruction popped return address from stack
            //remove arguments from the var map
            for (const arg of statement.arguments) {
                this.vars.delete(arg.identifier);
            }
            this.writeText(new AssemblyUnoptimizedToken(`${label}:`));
        } else if (statement instanceof StatementTerm) {
            this.generateTerm(statement.term);
        } else if (statement instanceof StatementReturn) {
            this.generateExpr(statement.expression);
            const idents = Array.from(this.functions.keys());
            const functionDepth = this.functions.get(idents[idents.length - 1])
                .scope.innerScopeDepth;
            let varPopCount =
                this.vars.size - this.scopes[this.scopes.length - 1];
            for (let i = this.scopes.length - 1; functionDepth <= i; i--) {
                varPopCount += this.scopes[i] - this.scopes[i - 1];
            }
            this.pop("rax", "mov return value into rax");
            this.writeText(
                new AssemblyAddToken(
                    "rsp",
                    (varPopCount * 8).toString(),
                    "move stack pointer for each var in scope",
                ),
            );
            this.writeText(
                new AssemblyUnoptimizedToken("    ret", "return value"),
            );
        }
    }

    /** Generate asm from the token array
     * @returns {string} the asm
     * */
    generateProgram() {
        for (const statement of this.program.statements) {
            this.generateStatement(statement);
        }

        this.writeText(new AssemblyMovToken("rax", "60"));
        this.writeText(new AssemblyMovToken("rdi", "0"));
        this.writeText(new AssemblyUnoptimizedToken("    syscall"));

        return {
            data: this.data,
            bss: this.bss,
            text: this.textTokens,
            routines: this.routines,
        };
    }
}
