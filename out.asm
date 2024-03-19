section .data
    ident0 dq 2.7182818284590
    ident1 dq 3.1415926535897
    ident2 dq 0.00000001
    ident3 dq 0.5
    ident4 dq 0.5
    ident5 dq 0.000000001
    ident6 dq 0.0000000001
    ident7 dq 0.0
    ident8 dq 1.0
    ident9 dq 1.0
    ident10 dq 0.0
    ident11 dq 0.0
    ident12 dq 3.1415926535897
    ident13 dq 0.0
    ident14 dq 2.0
    ident15 dq 0.0
    ident16 dq 3.1415926535897
    ident17 dq 0.0
    ident18 dq 2.0
    ident19 dq 0.0
    ident20 dq 0.0
    ident21 dq 0.00001
    ident22 dq 0.0
    ident23 dq 1.0
    ident24 dq 0.0
    ident25 dq 2.0
    ident26 dq 10.0
    ident27 db "true", 0
    ident28 db "false", 0
    newline db 10
    ident29 db "", 0
    ident30 db "0", 0
    ident31 dq 10.0
    ident32 db " ", 0
    ident33 dq 10.0
    ident34 dq 10.0
    ident35 db "-", 0
    ident36 db "", 0
    ident37 db "-", 0
    ident38 db "", 0
    ident39 db "", 0
    ident40 db "0", 0
    ident41 dq 10.0
    ident42 db " ", 0
    ident43 dq 0.0
    ident44 db ".", 0
    ident45 dq 0.00001
    ident46 db " ", 0
    ident47 db "nigger ", 0
    ident48 db "what", 0
    ident49 db "asdvdawrv", 0
    ident50 db "ert34", 0
    ident51 db "op83240", 0
section .bss

section .text
    global _start
_start:
    mov rbp, rsp
     ; start function definition
    jmp label0
_getUnix:
     ; start scope on line 1 in file stdlib/sys.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    mov rax, 201
    xor rdi, rdi
    syscall
    mov rdi, 1000
    mul rdi
    mov r14, rax
     ; end scope that started on line 1 in file stdlib/sys.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label0:
     ; start function definition
    jmp label1
_malloc:
     ; start scope on line 11 in file stdlib/sys.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    mov rsi, [rbp + 16]
    xor rdi, rdi
    mov rdx, 0x07
    mov r10, 0x22
    mov r8, -1
    mov r9, 0
    mov rax, 9
    syscall
    mov r14, rax
     ; end scope that started on line 11 in file stdlib/sys.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label1:
     ; start function definition
    jmp label2
_free:
     ; start scope on line 24 in file stdlib/sys.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    mov rsi, [rbp + 16]
    mov rdi, rax
    mov rax, 11
    syscall
    mov r14, 0
     ; end scope that started on line 24 in file stdlib/sys.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label2:
     ; start let statement
    mov rax, [ident0] ; generate term float
    push rax
     ; start let statement
    mov rax, [ident1] ; generate term float
    push rax
     ; start function definition
    jmp label3
_abs:
     ; start scope on line 5 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start if statement
     ; binary '<'
    push QWORD [rbp + 16] ; generate term from identifier absInput
    push 0 ; generate term integer 0
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    comisd xmm0, xmm1
    setb al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label4
     ; start scope on line 6 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; binary multiply
    push QWORD [rbp + 24] ; generate term from identifier absInput
    push -1 ; generate term integer -1
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    mulsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop r14 ; mov return value into r14
     ; end scope that started on line 6 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label5
label4:
     ; start else statement
     ; start scope on line 9 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    push QWORD [rbp + 24] ; generate term from identifier absInput
    pop r14 ; mov return value into r14
     ; end scope that started on line 9 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label5:
     ; end scope that started on line 5 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label3:
     ; start function definition
    jmp label6
_mod:
     ; start scope on line 14 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
label7:
     ; binary '>='
    push QWORD [rbp + 24] ; generate term from identifier dividend
    push QWORD [rbp + 16] ; generate term from identifier divisor
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    comisd xmm0, xmm1
    setae al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label8
     ; while statement scope
     ; start scope on line 15 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start reassign statement
     ; binary subtract
    push QWORD [rbp + 32] ; generate term from identifier dividend
    push QWORD [rbp + 24] ; generate term from identifier divisor
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    subsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rax
    mov [rbp + 32], rax
     ; end scope that started on line 15 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label7
label8:
    push QWORD [rbp + 24] ; generate term from identifier dividend
    pop r14 ; mov return value into r14
     ; end scope that started on line 14 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label6:
     ; start function definition
    jmp label9
_round:
     ; start scope on line 22 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; binary add
    push QWORD [rbp + 16] ; generate term from identifier roundInput
    mov rax, [ident2] ; generate term float
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    addsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rax
    movq xmm0, rax ; convert float to int
    cvtsd2si rax, xmm0
    push rax
    pop r14 ; mov return value into r14
     ; end scope that started on line 22 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label9:
     ; start function definition
    jmp label10
_floor:
     ; start scope on line 26 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; binary subtract
    push QWORD [rbp + 16] ; generate term from identifier floorInput
    mov rax, [ident3] ; generate term float
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    subsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    call _round ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    pop r14 ; mov return value into r14
     ; end scope that started on line 26 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label10:
     ; start function definition
    jmp label11
_ceil:
     ; start scope on line 30 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; binary add
    push QWORD [rbp + 16] ; generate term from identifier ceilInput
    mov rax, [ident4] ; generate term float
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    addsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    call _round ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    pop r14 ; mov return value into r14
     ; end scope that started on line 30 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label11:
     ; start function definition
    jmp label12
_factorial:
     ; start scope on line 35 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start if statement
     ; binary or
     ; binary compare
    push QWORD [rbp + 16] ; generate term from identifier factorialInput
    push 0 ; generate term integer 0
    pop rbx
    pop rax
    cmp rax, rbx
    sete al
    movzx rax, al
    push rax
     ; binary compare
    push QWORD [rbp + 16] ; generate term from identifier factorialInput
    push 1 ; generate term integer 1
    pop rbx
    pop rax
    cmp rax, rbx
    sete al
    movzx rax, al
    push rax
    pop rbx
    pop rax
    or rax, rbx
    push rax
    pop rax
    test rax, rax
    jz label13
     ; start scope on line 37 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    push 1 ; generate term integer 1
    pop r14 ; mov return value into r14
     ; end scope that started on line 37 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label14
label13:
     ; start elseif statement
     ; binary compare
    push QWORD [rbp + 16] ; generate term from identifier factorialInput
    push -1 ; generate term integer -1
    pop rbx
    pop rax
    cmp rax, rbx
    sete al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label15
     ; start scope on line 40 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    push -1 ; generate term integer -1
    pop r14 ; mov return value into r14
     ; end scope that started on line 40 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label14
label15:
     ; start else statement
     ; start scope on line 43 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start let statement
    push 1 ; generate term integer 1
     ; start let statement
     ; binary '<'
    push QWORD [rbp + 24] ; generate term from identifier factorialInput
    push 0 ; generate term integer 0
    pop rbx
    pop rax
    cmp rax, rbx
    setl al
    movzx rax, al
    push rax
     ; start reassign statement
    push QWORD [rbp + 24] ; generate term from identifier factorialInput
    pop rax
    cvtsi2sd xmm0, rax ; convert int to float
    movq rax, xmm0
    push rax
    call _abs ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    call _round ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    pop rax
    mov [rbp + 24], rax
     ; start let statement
    push 2 ; generate term integer 2
label16:
     ; binary '<='
    push QWORD [rbp + -24] ; generate term from identifier i
    push QWORD [rbp + 24] ; generate term from identifier factorialInput
    pop rbx
    pop rax
    cmp rax, rbx
    setle al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label17
     ; for statement scope
     ; start scope on line 47 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start reassign statement
     ; binary multiply
    push QWORD [rbp + 24] ; generate term from identifier result
    push QWORD [rbp + 8] ; generate term from identifier i
    pop rbx
    pop rax
    mul rbx
    push rax
    pop rax
    mov [rbp + 24], rax
     ; end scope that started on line 47 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
     ; start reassign statement
     ; binary add
    push QWORD [rbp + -24] ; generate term from identifier i
    push 1 ; generate term integer 1
    pop rbx
    pop rax
    add rax, rbx
    push rax
    pop rax
    mov [rbp + -24], rax
    jmp label16
label17:
    add rsp, 8
     ; start if statement
    push QWORD [rbp + -16] ; generate term from identifier isNeg
    pop rax
    test rax, rax
    jz label18
     ; start scope on line 50 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; binary multiply
    push QWORD [rbp + 16] ; generate term from identifier result
    push -1 ; generate term integer -1
    pop rbx
    pop rax
    mul rbx
    push rax
    pop r14 ; mov return value into r14
     ; end scope that started on line 50 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label19
label18:
     ; start else statement
     ; start scope on line 54 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    push QWORD [rbp + 16] ; generate term from identifier result
    pop r14 ; mov return value into r14
     ; end scope that started on line 54 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label19:
     ; end scope that started on line 43 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label14:
     ; end scope that started on line 35 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label12:
     ; start function definition
    jmp label20
_exp:
     ; start scope on line 60 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start let statement
    mov rax, [ident5] ; generate term float
    push rax
     ; start let statement
    push 1 ; generate term integer 1
    pop rax
    cvtsi2sd xmm0, rax ; convert int to float
    movq rax, xmm0
    push rax
     ; start let statement
    push 1 ; generate term integer 1
    pop rax
    cvtsi2sd xmm0, rax ; convert int to float
    movq rax, xmm0
    push rax
     ; start let statement
    push 1 ; generate term integer 1
label21:
     ; binary '>'
    push QWORD [rbp + -16] ; generate term from identifier term
    call _abs ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    push QWORD [rbp + -8] ; generate term from identifier epsilon
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    comisd xmm0, xmm1
    seta al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label22
     ; while statement scope
     ; start scope on line 65 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start reassign statement
     ; binary multiply
    push QWORD [rbp + 24] ; generate term from identifier term
     ; binary divide
    push QWORD [rbp + 56] ; generate term from identifier expInput
    push QWORD [rbp + 8] ; generate term from identifier n
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    divsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    mulsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rax
    mov [rbp + 24], rax
     ; start reassign statement
     ; binary add
    push QWORD [rbp + 16] ; generate term from identifier sum
    push QWORD [rbp + 24] ; generate term from identifier term
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    addsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rax
    mov [rbp + 16], rax
     ; start reassign statement
     ; binary add
    push QWORD [rbp + 8] ; generate term from identifier n
    push 1 ; generate term integer 1
    pop rbx
    pop rax
    add rax, rbx
    push rax
    pop rax
    mov [rbp + 8], rax
     ; end scope that started on line 65 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label21
label22:
    push QWORD [rbp + -24] ; generate term from identifier sum
    pop r14 ; mov return value into r14
     ; end scope that started on line 60 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label20:
     ; start function definition
    jmp label23
_loge:
     ; start scope on line 73 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start if statement
     ; binary '<='
    push QWORD [rbp + 16] ; generate term from identifier logeInput
    push 0 ; generate term integer 0
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    comisd xmm0, xmm1
    setbe al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label24
     ; start scope on line 74 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    push 0 ; generate term integer 0
    pop rax
    cvtsi2sd xmm0, rax ; convert int to float
    movq rax, xmm0
    push rax
    pop r14 ; mov return value into r14
     ; end scope that started on line 74 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label25
label24:
     ; start else statement
     ; start scope on line 76 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start let statement
    mov rax, [ident6] ; generate term float
    push rax
     ; start let statement
     ; binary divide
     ; binary subtract
    push QWORD [rbp + 24] ; generate term from identifier logeInput
    push 1 ; generate term integer 1
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    subsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
     ; binary add
    push QWORD [rbp + 24] ; generate term from identifier logeInput
    push 1 ; generate term integer 1
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    addsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    divsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
     ; start let statement
    push QWORD [rbp + -16] ; generate term from identifier term
     ; start let statement
    push QWORD [rbp + -16] ; generate term from identifier term
     ; start let statement
    push 3 ; generate term integer 3
label26:
     ; binary '>'
    push QWORD [rbp + -32] ; generate term from identifier power
    call _abs ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    push QWORD [rbp + -8] ; generate term from identifier epsilon
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    comisd xmm0, xmm1
    seta al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label27
     ; while statement scope
     ; start scope on line 82 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start reassign statement
     ; binary multiply
    push QWORD [rbp + 16] ; generate term from identifier power
     ; binary multiply
    push QWORD [rbp + 32] ; generate term from identifier term
    push QWORD [rbp + 32] ; generate term from identifier term
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    mulsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    mulsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rax
    mov [rbp + 16], rax
     ; start reassign statement
     ; binary add
    push QWORD [rbp + 24] ; generate term from identifier sum
     ; binary divide
    push QWORD [rbp + 16] ; generate term from identifier power
    push QWORD [rbp + 8] ; generate term from identifier n
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    divsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    addsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rax
    mov [rbp + 24], rax
     ; start reassign statement
     ; binary add
    push QWORD [rbp + 8] ; generate term from identifier n
    push 2 ; generate term integer 2
    pop rbx
    pop rax
    add rax, rbx
    push rax
    pop rax
    mov [rbp + 8], rax
     ; end scope that started on line 82 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label26
label27:
     ; binary multiply
    push 2 ; generate term integer 2
    push QWORD [rbp + -24] ; generate term from identifier sum
    pop rbx
    pop rax
    cvtsi2sd xmm0, rax
    movq xmm1, rbx
    mulsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop r14 ; mov return value into r14
     ; end scope that started on line 76 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label25:
     ; end scope that started on line 73 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label23:
     ; start function definition
    jmp label28
_pow:
     ; start scope on line 91 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start if statement
     ; binary compare
    push QWORD [rbp + 16] ; generate term from identifier exponent
    mov rax, [ident7] ; generate term float
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    cmpsd xmm0, xmm1, 0
    movq qword rax, xmm0
    push rax
    pop rax
    test rax, rax
    jz label29
     ; start scope on line 92 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    mov rax, [ident8] ; generate term float
    push rax
    pop r14 ; mov return value into r14
     ; end scope that started on line 92 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label30
label29:
     ; start elseif statement
     ; binary compare
    push QWORD [rbp + 16] ; generate term from identifier exponent
    mov rax, [ident9] ; generate term float
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    cmpsd xmm0, xmm1, 0
    movq qword rax, xmm0
    push rax
    pop rax
    test rax, rax
    jz label31
     ; start scope on line 94 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    push QWORD [rbp + 32] ; generate term from identifier base
    pop r14 ; mov return value into r14
     ; end scope that started on line 94 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label30
label31:
     ; start elseif statement
     ; binary '<'
    push QWORD [rbp + 16] ; generate term from identifier exponent
    push 0 ; generate term integer 0
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    comisd xmm0, xmm1
    setb al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label32
     ; start scope on line 96 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; binary divide
    push 1 ; generate term integer 1
    push QWORD [rbp + 32] ; generate term from identifier base
     ; binary multiply
    push -1 ; generate term integer -1
    push QWORD [rbp + 24] ; generate term from identifier exponent
    pop rbx
    pop rax
    cvtsi2sd xmm0, rax
    movq xmm1, rbx
    mulsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    call _pow ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    pop rbx
    pop rax
    cvtsi2sd xmm0, rax
    movq xmm1, rbx
    divsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop r14 ; mov return value into r14
     ; end scope that started on line 96 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label30
label32:
     ; start elseif statement
     ; binary compare
    push QWORD [rbp + 24] ; generate term from identifier base
    mov rax, [ident10] ; generate term float
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    cmpsd xmm0, xmm1, 0
    movq qword rax, xmm0
    push rax
    pop rax
    test rax, rax
    jz label33
     ; start scope on line 98 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    mov rax, [ident11] ; generate term float
    push rax
    pop r14 ; mov return value into r14
     ; end scope that started on line 98 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label30
label33:
     ; start else statement
     ; start scope on line 100 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; binary multiply
    push QWORD [rbp + 24] ; generate term from identifier exponent
    push QWORD [rbp + 32] ; generate term from identifier base
    call _loge ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    mulsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    call _exp ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    pop r14 ; mov return value into r14
     ; end scope that started on line 100 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label30:
     ; end scope that started on line 91 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label28:
     ; start function definition
    jmp label34
_max:
     ; start scope on line 105 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start if statement
     ; binary '>'
    push QWORD [rbp + 24] ; generate term from identifier maxInput1
    push QWORD [rbp + 16] ; generate term from identifier maxInput2
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    comisd xmm0, xmm1
    seta al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label35
     ; start scope on line 106 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    push QWORD [rbp + 32] ; generate term from identifier maxInput1
    pop r14 ; mov return value into r14
     ; end scope that started on line 106 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label36
label35:
     ; start else statement
     ; start scope on line 108 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    push QWORD [rbp + 24] ; generate term from identifier maxInput2
    pop r14 ; mov return value into r14
     ; end scope that started on line 108 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label36:
     ; end scope that started on line 105 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label34:
     ; start function definition
    jmp label37
_min:
     ; start scope on line 112 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start if statement
     ; binary '<'
    push QWORD [rbp + 24] ; generate term from identifier minInput1
    push QWORD [rbp + 16] ; generate term from identifier minInput2
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    comisd xmm0, xmm1
    setb al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label38
     ; start scope on line 113 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    push QWORD [rbp + 32] ; generate term from identifier minInput1
    pop r14 ; mov return value into r14
     ; end scope that started on line 113 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label39
label38:
     ; start else statement
     ; start scope on line 115 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    push QWORD [rbp + 24] ; generate term from identifier minInput2
    pop r14 ; mov return value into r14
     ; end scope that started on line 115 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label39:
     ; end scope that started on line 112 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label37:
     ; start function definition
    jmp label40
_sin:
     ; start scope on line 120 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start let statement
    push 10 ; generate term integer 10
     ; start reassign statement
     ; binary divide
     ; binary multiply
    push QWORD [rbp + 16] ; generate term from identifier sinAngle
    mov rax, [ident12] ; generate term float
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    mulsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    push 180 ; generate term integer 180
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    divsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rax
    mov [rbp + 16], rax
     ; start let statement
    mov rax, [ident13] ; generate term float
    push rax
     ; start let statement
    push 0 ; generate term integer 0
label41:
     ; binary '<'
    push QWORD [rbp + -24] ; generate term from identifier i
    push QWORD [rbp + -8] ; generate term from identifier terms
    pop rbx
    pop rax
    cmp rax, rbx
    setl al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label42
     ; for statement scope
     ; start scope on line 124 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start let statement
    push 0 ; generate term integer 0
     ; start if statement
     ; binary compare
    push QWORD [rbp + 8] ; generate term from identifier i
    pop rax
    cvtsi2sd xmm0, rax ; convert int to float
    movq rax, xmm0
    push rax
    mov rax, [ident14] ; generate term float
    push rax
    call _mod ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    mov rax, [ident15] ; generate term float
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    cmpsd xmm0, xmm1, 0
    movq qword rax, xmm0
    push rax
    pop rax
    test rax, rax
    jz label43
     ; start scope on line 126 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start reassign statement
    push 1 ; generate term integer 1
    pop rax
    mov [rbp + 8], rax
     ; end scope that started on line 126 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label44
label43:
     ; start else statement
     ; start scope on line 128 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start reassign statement
    push -1 ; generate term integer -1
    pop rax
    mov [rbp + 8], rax
     ; end scope that started on line 128 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label44:
     ; start let statement
     ; binary add
     ; binary multiply
    push 2 ; generate term integer 2
    push QWORD [rbp + 8] ; generate term from identifier i
    pop rbx
    pop rax
    mul rbx
    push rax
    push 1 ; generate term integer 1
    pop rbx
    pop rax
    add rax, rbx
    push rax
     ; start reassign statement
     ; binary add
    push QWORD [rbp + 16] ; generate term from identifier result
     ; binary divide
     ; binary multiply
    push QWORD [rbp + -8] ; generate term from identifier coefficient
    push QWORD [rbp + 48] ; generate term from identifier sinAngle
    push QWORD [rbp + -16] ; generate term from identifier sinExponent
    pop rax
    cvtsi2sd xmm0, rax ; convert int to float
    movq rax, xmm0
    push rax
    call _pow ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    pop rbx
    pop rax
    cvtsi2sd xmm0, rax
    movq xmm1, rbx
    mulsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    push QWORD [rbp + -16] ; generate term from identifier sinExponent
    call _factorial ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    divsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    addsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rax
    mov [rbp + 16], rax
     ; end scope that started on line 124 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
     ; start reassign statement
     ; binary add
    push QWORD [rbp + -24] ; generate term from identifier i
    push 1 ; generate term integer 1
    pop rbx
    pop rax
    add rax, rbx
    push rax
    pop rax
    mov [rbp + -24], rax
    jmp label41
label42:
    add rsp, 8
    push QWORD [rbp + -16] ; generate term from identifier result
    pop r14 ; mov return value into r14
     ; end scope that started on line 120 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label40:
     ; start function definition
    jmp label45
_cos:
     ; start scope on line 136 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start let statement
    push 10 ; generate term integer 10
     ; start reassign statement
     ; binary divide
     ; binary multiply
    push QWORD [rbp + 16] ; generate term from identifier cosAngle
    mov rax, [ident16] ; generate term float
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    mulsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    push 180 ; generate term integer 180
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    divsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rax
    mov [rbp + 16], rax
     ; start let statement
    mov rax, [ident17] ; generate term float
    push rax
     ; start let statement
    push 0 ; generate term integer 0
label46:
     ; binary '<'
    push QWORD [rbp + -24] ; generate term from identifier i
    push QWORD [rbp + -8] ; generate term from identifier terms
    pop rbx
    pop rax
    cmp rax, rbx
    setl al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label47
     ; for statement scope
     ; start scope on line 140 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start let statement
    push 0 ; generate term integer 0
     ; start if statement
     ; binary compare
    push QWORD [rbp + 8] ; generate term from identifier i
    pop rax
    cvtsi2sd xmm0, rax ; convert int to float
    movq rax, xmm0
    push rax
    mov rax, [ident18] ; generate term float
    push rax
    call _mod ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    mov rax, [ident19] ; generate term float
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    cmpsd xmm0, xmm1, 0
    movq qword rax, xmm0
    push rax
    pop rax
    test rax, rax
    jz label48
     ; start scope on line 142 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start reassign statement
    push 1 ; generate term integer 1
    pop rax
    mov [rbp + 8], rax
     ; end scope that started on line 142 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label49
label48:
     ; start else statement
     ; start scope on line 144 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start reassign statement
    push -1 ; generate term integer -1
    pop rax
    mov [rbp + 8], rax
     ; end scope that started on line 144 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label49:
     ; start let statement
     ; binary multiply
    push 2 ; generate term integer 2
    push QWORD [rbp + 8] ; generate term from identifier i
    pop rbx
    pop rax
    mul rbx
    push rax
     ; start reassign statement
     ; binary add
    push QWORD [rbp + 16] ; generate term from identifier result
     ; binary divide
     ; binary multiply
    push QWORD [rbp + -8] ; generate term from identifier coefficient
    push QWORD [rbp + 48] ; generate term from identifier cosAngle
    push QWORD [rbp + -16] ; generate term from identifier cosExponent
    pop rax
    cvtsi2sd xmm0, rax ; convert int to float
    movq rax, xmm0
    push rax
    call _pow ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    pop rbx
    pop rax
    cvtsi2sd xmm0, rax
    movq xmm1, rbx
    mulsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    push QWORD [rbp + -16] ; generate term from identifier cosExponent
    call _factorial ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    divsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    addsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rax
    mov [rbp + 16], rax
     ; end scope that started on line 140 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
     ; start reassign statement
     ; binary add
    push QWORD [rbp + -24] ; generate term from identifier i
    push 1 ; generate term integer 1
    pop rbx
    pop rax
    add rax, rbx
    push rax
    pop rax
    mov [rbp + -24], rax
    jmp label46
label47:
    add rsp, 8
    push QWORD [rbp + -16] ; generate term from identifier result
    pop r14 ; mov return value into r14
     ; end scope that started on line 136 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label45:
     ; start function definition
    jmp label50
_tan:
     ; start scope on line 153 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start let statement
    push QWORD [rbp + 16] ; generate term from identifier tanAngle
    call _sin ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
     ; start let statement
    push QWORD [rbp + 16] ; generate term from identifier tanAngle
    call _cos ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
     ; binary divide
    push QWORD [rbp + -8] ; generate term from identifier sinVal
    push QWORD [rbp + -16] ; generate term from identifier cosVal
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    divsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop r14 ; mov return value into r14
     ; end scope that started on line 153 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label50:
     ; start function definition
    jmp label51
_sqrt:
     ; start scope on line 159 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start if statement
     ; binary or
     ; binary '<'
    push QWORD [rbp + 24] ; generate term from identifier sqrtValue
    push 0 ; generate term integer 0
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    comisd xmm0, xmm1
    setb al
    movzx rax, al
    push rax
     ; binary '<='
    push QWORD [rbp + 16] ; generate term from identifier sqrtBase
    push 1 ; generate term integer 1
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    comisd xmm0, xmm1
    setbe al
    movzx rax, al
    push rax
    pop rbx
    pop rax
    or rax, rbx
    push rax
    pop rax
    test rax, rax
    jz label52
     ; start scope on line 160 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    mov rax, [ident20] ; generate term float
    push rax
    pop r14 ; mov return value into r14
     ; end scope that started on line 160 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label52:
     ; start let statement
    mov rax, [ident21] ; generate term float
    push rax
     ; start let statement
    mov rax, [ident22] ; generate term float
    push rax
     ; start let statement
    push QWORD [rbp + 24] ; generate term from identifier sqrtValue
     ; start let statement
     ; binary divide
     ; binary add
    push QWORD [rbp + -16] ; generate term from identifier minVal
    push QWORD [rbp + -24] ; generate term from identifier maxVal
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    addsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    push 2 ; generate term integer 2
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    divsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
label53:
     ; binary '>'
     ; binary subtract
    push QWORD [rbp + -24] ; generate term from identifier maxVal
    push QWORD [rbp + -16] ; generate term from identifier minVal
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    subsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    push QWORD [rbp + -8] ; generate term from identifier epsilon
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    comisd xmm0, xmm1
    seta al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label54
     ; while statement scope
     ; start scope on line 168 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start let statement
    push QWORD [rbp + 8] ; generate term from identifier guess
    push QWORD [rbp + 56] ; generate term from identifier sqrtBase
    call _pow ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
     ; start if statement
     ; binary '<'
    push QWORD [rbp + -8] ; generate term from identifier powed
    push QWORD [rbp + 64] ; generate term from identifier sqrtValue
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    comisd xmm0, xmm1
    setb al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label55
     ; start scope on line 170 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start reassign statement
    push QWORD [rbp + 24] ; generate term from identifier guess
    pop rax
    mov [rbp + 40], rax
     ; end scope that started on line 170 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label56
label55:
     ; start elseif statement
     ; binary '>'
    push QWORD [rbp + -8] ; generate term from identifier powed
    push QWORD [rbp + 64] ; generate term from identifier sqrtValue
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    comisd xmm0, xmm1
    seta al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label57
     ; start scope on line 172 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start reassign statement
    push QWORD [rbp + 24] ; generate term from identifier guess
    pop rax
    mov [rbp + 32], rax
     ; end scope that started on line 172 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label56
label57:
     ; start else statement
     ; start scope on line 174 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    push QWORD [rbp + 24] ; generate term from identifier guess
    pop r14 ; mov return value into r14
     ; end scope that started on line 174 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label56:
     ; start reassign statement
     ; binary divide
     ; binary add
    push QWORD [rbp + 24] ; generate term from identifier minVal
    push QWORD [rbp + 16] ; generate term from identifier maxVal
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    addsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    push 2 ; generate term integer 2
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    divsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rax
    mov [rbp + 8], rax
     ; end scope that started on line 168 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label53
label54:
    push QWORD [rbp + -32] ; generate term from identifier guess
    pop r14 ; mov return value into r14
     ; end scope that started on line 159 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label51:
     ; start function definition
    jmp label58
_logx:
     ; start scope on line 184 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start if statement
     ; binary or
     ; binary or
     ; binary '<='
    push QWORD [rbp + 24] ; generate term from identifier logxNumber
    push 0 ; generate term integer 0
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    comisd xmm0, xmm1
    setbe al
    movzx rax, al
    push rax
     ; binary '<='
    push QWORD [rbp + 16] ; generate term from identifier logxBase
    push 0 ; generate term integer 0
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    comisd xmm0, xmm1
    setbe al
    movzx rax, al
    push rax
    pop rbx
    pop rax
    or rax, rbx
    push rax
     ; binary compare
    push QWORD [rbp + 16] ; generate term from identifier logxBase
    mov rax, [ident23] ; generate term float
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    cmpsd xmm0, xmm1, 0
    movq qword rax, xmm0
    push rax
    pop rbx
    pop rax
    or rax, rbx
    push rax
    pop rax
    test rax, rax
    jz label59
     ; start scope on line 185 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    mov rax, [ident24] ; generate term float
    push rax
    pop r14 ; mov return value into r14
     ; end scope that started on line 185 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label59:
     ; binary divide
    push QWORD [rbp + 24] ; generate term from identifier logxNumber
    call _loge ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    push QWORD [rbp + 16] ; generate term from identifier logxBase
    call _loge ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    divsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop r14 ; mov return value into r14
     ; end scope that started on line 184 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label58:
     ; start function definition
    jmp label60
_log2:
     ; start scope on line 192 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    push QWORD [rbp + 16] ; generate term from identifier logValue
    mov rax, [ident25] ; generate term float
    push rax
    call _logx ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    pop r14 ; mov return value into r14
     ; end scope that started on line 192 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label60:
     ; start function definition
    jmp label61
_log10:
     ; start scope on line 197 in file stdlib/math.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    push QWORD [rbp + 16] ; generate term from identifier logValue
    mov rax, [ident26] ; generate term float
    push rax
    call _logx ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    pop r14 ; mov return value into r14
     ; end scope that started on line 197 in file stdlib/math.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label61:
     ; start function definition
    jmp label62
_stringLength:
     ; start scope on line 4 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    mov rdi, [rbp + 16]
    xor eax, eax
    pxor xmm0, xmm0
.loop:
    movdqu xmm1, [rdi + rax]
    pcmpeqb xmm1, xmm0
    pmovmskb ecx, xmm1
    lea rax, [eax + 16]
    test ecx, ecx
    jz .loop
    bsf ecx, ecx
    lea rax, [rax + rcx - 16]
    mov r14, rax
     ; end scope that started on line 4 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label62:
     ; start function definition
    jmp label63
_fromBool:
     ; start scope on line 23 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start if statement
    push QWORD [rbp + 16] ; generate term from identifier input
    pop rax
    test rax, rax
    jz label64
     ; start scope on line 24 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    push ident27 ; generate string from term
    pop r14 ; mov return value into r14
     ; end scope that started on line 24 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label65
label64:
     ; start else statement
     ; start scope on line 26 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    push ident28 ; generate string from term
    pop r14 ; mov return value into r14
     ; end scope that started on line 26 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label65:
     ; end scope that started on line 23 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label63:
     ; start function definition
    jmp label66
_stringCopy:
     ; start scope on line 31 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    mov rdi, [rbp + 16]
    mov rsi, [rbp + 24]
    cmp	di, 0
    je strcpy_done
    cmp	rsi, 0
    je strcpy_done
    mov rcx, -1
strcpy_loop:
    inc	rcx
    mov	al, byte [rsi + rcx]
    mov	byte [rdi + rcx], al
    cmp	al, 0
    jne	strcpy_loop
strcpy_done:
    mov	r14, rdi
     ; end scope that started on line 31 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label66:
     ; start function definition
    jmp label67
_concat:
     ; start scope on line 50 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start let statement
    push QWORD [rbp + 24] ; generate term from identifier prefix
    call _stringLength ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
     ; start let statement
    push QWORD [rbp + 16] ; generate term from identifier suffix
    call _stringLength ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
     ; start let statement
     ; binary add
     ; binary add
    push QWORD [rbp + -8] ; generate term from identifier prefixLength
    push QWORD [rbp + -16] ; generate term from identifier suffixLength
    pop rbx
    pop rax
    add rax, rbx
    push rax
    push 1 ; generate term integer 1
    pop rbx
    pop rax
    add rax, rbx
    push rax
    call _malloc ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    push QWORD [rbp + 24] ; generate term from identifier prefix
    push QWORD [rbp + -24] ; generate term from identifier point
    call _stringCopy ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    pop r15 ; dump value generated by statement term
    push QWORD [rbp + 16] ; generate term from identifier suffix
     ; binary add
    push QWORD [rbp + -24] ; generate term from identifier point
    push QWORD [rbp + -8] ; generate term from identifier prefixLength
    pop rbx
    pop rax
    add rax, rbx
    push rax
    call _stringCopy ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    pop r15 ; dump value generated by statement term
     ; binary add
     ; binary add
    push QWORD [rbp + -8] ; generate term from identifier prefixLength
    push QWORD [rbp + -16] ; generate term from identifier suffixLength
    pop rbx
    pop rax
    add rax, rbx
    push rax
    push 1 ; generate term integer 1
    pop rbx
    pop rax
    add rax, rbx
    push rax
    call _free ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    pop r15 ; dump value generated by statement term
    push QWORD [rbp + -24] ; generate term from identifier point
    pop r14 ; mov return value into r14
     ; end scope that started on line 50 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label67:
     ; start function definition
    jmp label68
_println:
     ; start scope on line 60 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start let statement
    push QWORD [rbp + 16] ; generate term from identifier input
    call _stringLength ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    mov rax, 1
    mov rdi, 1
    mov rsi, [rbp + 16]
    mov rdx, [rbp - 8]
    syscall
    mov rax, 1
    mov rsi, newline
    mov rdx, 1
    syscall
     ; end scope that started on line 60 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label68:
     ; start function definition
    jmp label69
_fromInt:
     ; start scope on line 75 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start let statement
    push ident29 ; generate string from term
     ; start if statement
     ; binary compare
    push QWORD [rbp + 16] ; generate term from identifier number
    push 0 ; generate term integer 0
    pop rbx
    pop rax
    cmp rax, rbx
    sete al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label70
     ; start scope on line 77 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
    push ident30 ; generate string from term
    pop r14 ; mov return value into r14
     ; end scope that started on line 77 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label71
label70:
     ; start else statement
     ; start scope on line 79 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start let statement
    push 0 ; generate boolean from term
     ; start if statement
     ; binary '<'
    push QWORD [rbp + 32] ; generate term from identifier number
    push 0 ; generate term integer 0
    pop rbx
    pop rax
    cmp rax, rbx
    setl al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label72
     ; start scope on line 81 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start reassign statement
    push 1 ; generate boolean from term
    pop rax
    mov [rbp + 8], rax
     ; start reassign statement
     ; binary multiply
    push -1 ; generate term integer -1
    push QWORD [rbp + 48] ; generate term from identifier number
    pop rbx
    pop rax
    mul rbx
    push rax
    pop rax
    mov [rbp + 48], rax
     ; end scope that started on line 81 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label72:
label73:
     ; binary '>'
    push QWORD [rbp + 32] ; generate term from identifier number
    push 0 ; generate term integer 0
    pop rbx
    pop rax
    cmp rax, rbx
    setg al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label74
     ; while statement scope
     ; start scope on line 85 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start let statement
     ; binary add
    push QWORD [rbp + 48] ; generate term from identifier number
    pop rax
    cvtsi2sd xmm0, rax ; convert int to float
    movq rax, xmm0
    push rax
    mov rax, [ident31] ; generate term float
    push rax
    call _mod ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    push 48 ; generate term integer 48
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    addsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rax
    movq xmm0, rax ; convert float to int
    cvtsd2si rax, xmm0
    push rax
     ; start let statement
    push ident32 ; generate string from term
    mov r13, [rbp - 8]
    mov qword rax, qword [rbp - 16]
    mov [rax], r13
     ; start reassign statement
    push QWORD [rbp + -16] ; generate term from identifier stringified
    push QWORD [rbp + 24] ; generate term from identifier result
    call _concat ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    pop rax
    mov [rbp + 24], rax
     ; start let statement
     ; binary divide
    push QWORD [rbp + 48] ; generate term from identifier number
    mov rax, [ident33] ; generate term float
    push rax
    pop rbx
    pop rax
    cvtsi2sd xmm0, rax
    movq xmm1, rbx
    divsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rax
    movq xmm0, rax ; convert float to int
    cvtsd2si rax, xmm0
    push rax
     ; start reassign statement
     ; binary divide
    push QWORD [rbp + 48] ; generate term from identifier number
    mov rax, [ident34] ; generate term float
    push rax
    pop rbx
    pop rax
    cvtsi2sd xmm0, rax
    movq xmm1, rbx
    divsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    call _floor ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    pop rax
    mov [rbp + 48], rax
     ; end scope that started on line 85 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label73
label74:
     ; start if statement
    push QWORD [rbp + -8] ; generate term from identifier isNeg
    pop rax
    test rax, rax
    jz label75
     ; start scope on line 97 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start reassign statement
    push ident35 ; generate string from term
    push QWORD [rbp + 24] ; generate term from identifier result
    call _concat ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    pop rax
    mov [rbp + 24], rax
     ; end scope that started on line 97 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label75:
    push QWORD [rbp + 8] ; generate term from identifier result
    pop r14 ; mov return value into r14
     ; end scope that started on line 79 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label71:
     ; end scope that started on line 75 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label69:
     ; start function definition
    jmp label76
_fromFloat:
     ; start scope on line 104 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start let statement
    push ident36 ; generate string from term
     ; start if statement
     ; binary '<'
    push QWORD [rbp + 16] ; generate term from identifier number
    push 0 ; generate term integer 0
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    comisd xmm0, xmm1
    setb al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label77
     ; start scope on line 106 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start reassign statement
    push ident37 ; generate string from term
    pop rax
    mov [rbp + 8], rax
     ; end scope that started on line 106 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label77:
     ; start reassign statement
    push QWORD [rbp + 16] ; generate term from identifier number
    call _abs ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    pop rax
    mov [rbp + 16], rax
     ; start let statement
    push QWORD [rbp + 16] ; generate term from identifier number
    call _floor ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
     ; start let statement
     ; binary subtract
    push QWORD [rbp + 16] ; generate term from identifier number
    push QWORD [rbp + -16] ; generate term from identifier integralPart
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    subsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
     ; start let statement
    push ident38 ; generate string from term
     ; start let statement
    push ident39 ; generate string from term
     ; start if statement
     ; binary compare
    push QWORD [rbp + -16] ; generate term from identifier integralPart
    push 0 ; generate term integer 0
    pop rbx
    pop rax
    cmp rax, rbx
    sete al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label78
     ; start scope on line 115 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start reassign statement
    push ident40 ; generate string from term
    pop rax
    mov [rbp + 16], rax
     ; end scope that started on line 115 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label79
label78:
     ; start else statement
     ; start scope on line 117 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
label80:
     ; binary '>'
    push QWORD [rbp + 32] ; generate term from identifier integralPart
    push 0 ; generate term integer 0
    pop rbx
    pop rax
    cmp rax, rbx
    setg al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label81
     ; while statement scope
     ; start scope on line 118 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start let statement
     ; binary add
    push QWORD [rbp + 40] ; generate term from identifier integralPart
    pop rax
    cvtsi2sd xmm0, rax ; convert int to float
    movq rax, xmm0
    push rax
    mov rax, [ident41] ; generate term float
    push rax
    call _mod ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    push 48 ; generate term integer 48
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    addsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rax
    movq xmm0, rax ; convert float to int
    cvtsd2si rax, xmm0
    push rax
     ; start let statement
    push ident42 ; generate string from term
    mov r13, [rsp + 8]
    mov qword rax, qword [rsp]
    mov [rax], r13
     ; start reassign statement
    push QWORD [rbp + -16] ; generate term from identifier char
    push QWORD [rbp + 24] ; generate term from identifier integralString
    call _concat ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    pop rax
    mov [rbp + 24], rax
     ; start reassign statement
     ; binary divide
    push QWORD [rbp + 40] ; generate term from identifier integralPart
    push 10 ; generate term integer 10
    pop rbx
    pop rax
    cvtsi2sd xmm0, rax
    cvtsi2sd xmm1, rbx
    divsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    call _floor ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    pop rax
    mov [rbp + 40], rax
     ; end scope that started on line 118 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label80
label81:
     ; end scope that started on line 117 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label79:
     ; start if statement
     ; inversed binary compare
    push QWORD [rbp + -24] ; generate term from identifier fractionalPart
    mov rax, [ident43] ; generate term float
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    cmpsd xmm0, xmm1, 0
    movq qword rax, xmm0
    not rax
    push rax
    pop rax
    test rax, rax
    jz label82
     ; start scope on line 129 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start reassign statement
    push ident44 ; generate string from term
    pop rax
    mov [rbp + 8], rax
label83:
     ; binary '>'
    push QWORD [rbp + 24] ; generate term from identifier fractionalPart
    mov rax, [ident45] ; generate term float
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    movq xmm1, rbx
    comisd xmm0, xmm1
    seta al
    movzx rax, al
    push rax
    pop rax
    test rax, rax
    jz label84
     ; while statement scope
     ; start scope on line 131 in file stdlib/str.ejo
    push rbp
    mov rbp, rsp ; adjust base pointer
     ; start print statement
    push QWORD [rbp + 16] ; generate term from identifier fractionalString
    pop rsi
    mov rdi, rsi
    call calc_string_length
    mov rdx, rax
    mov rax, 1
    mov rdi, 1
    syscall
     ; start reassign statement
     ; binary multiply
    push QWORD [rbp + 32] ; generate term from identifier fractionalPart
    push 10 ; generate term integer 10
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    mulsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rax
    mov [rbp + 32], rax
     ; start let statement
     ; binary add
    push QWORD [rbp + 32] ; generate term from identifier fractionalPart
    call _floor ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    push 48 ; generate term integer 48
    pop rbx
    pop rax
    add rax, rbx
    push rax
     ; start let statement
    push ident46 ; generate string from term
    mov r13, [rsp + 8]
    mov qword rax, qword [rsp]
    mov [rax], r13
     ; start reassign statement
    push QWORD [rbp + 16] ; generate term from identifier fractionalString
    push QWORD [rbp + -16] ; generate term from identifier char
    call _concat ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    pop rax
    mov [rbp + 16], rax
     ; start reassign statement
     ; binary subtract
    push QWORD [rbp + 32] ; generate term from identifier fractionalPart
     ; binary subtract
    push QWORD [rbp + -8] ; generate term from identifier digit
    push 48 ; generate term integer 48
    pop rbx
    pop rax
    sub rax, rbx
    push rax
    pop rbx
    pop rax
    movq xmm0, rax
    cvtsi2sd xmm1, rbx
    subsd xmm0, xmm1
    movq qword rax, xmm0
    push rax
    pop rax
    mov [rbp + 32], rax
     ; end scope that started on line 131 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    jmp label83
label84:
     ; end scope that started on line 129 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
label82:
     ; start let statement
    push QWORD [rbp + -32] ; generate term from identifier integralString
    push QWORD [rbp + -40] ; generate term from identifier fractionalString
    call _concat ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    push QWORD [rbp + -8] ; generate term from identifier prefix
    push QWORD [rbp + -48] ; generate term from identifier combined
    call _concat ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    pop r14 ; mov return value into r14
     ; end scope that started on line 104 in file stdlib/str.ejo
    mov rsp, rbp ; reset stack pointer
    pop rbp
    ret
label76:
    push ident47 ; generate string from term
    push ident48 ; generate string from term
    call _concat ; call function
    add rsp, 16 ; pop function arguments
    push r14 ; push return value to stack
    call _println ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    pop r15 ; dump value generated by statement term
    push ident49 ; generate string from term
    call _println ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    pop r15 ; dump value generated by statement term
    push ident50 ; generate string from term
    call _println ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    pop r15 ; dump value generated by statement term
    push ident51 ; generate string from term
    call _println ; call function
    add rsp, 8 ; pop function arguments
    push r14 ; push return value to stack
    pop r15 ; dump value generated by statement term
    mov rax, 60
    mov rdi, 0
    syscall

; routines
calc_string_length:
    xor       eax, eax
    pxor      xmm0, xmm0
.loop:
    movdqu    xmm1, [rdi + rax]
    pcmpeqb   xmm1, xmm0
    pmovmskb  ecx, xmm1
    lea       eax, [eax + 16]
    test      ecx, ecx
    jz        .loop
    bsf       ecx, ecx
    lea       rax, [rax + rcx - 16]
    ret
