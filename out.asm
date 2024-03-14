section .data
    ident0 db "true", 0
    ident1 db "false", 0
    ident2 db "Hello, ", 0
    ident3 db "World!", 0
section .bss

section .text
    global _start
_start:
    mov rbp, rsp
    jmp label0
_malloc:
    push rbp
    mov rbp, rsp
    mov rsi, [rbp + 16]
    xor rdi, rdi
    mov rdx, 0x07
    mov r10, 0x22
    mov r8, -1
    mov r9, 0
    mov rax, 9
    syscall
    mov r14, rax
    mov rsp, rbp
    pop rbp
    ret
label0:
    jmp label1
_stringLength:
    push rbp
    mov rbp, rsp
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
    mov rsp, rbp
    pop rbp
    ret
label1:
    jmp label2
_println:
    push rbp
    mov rbp, rsp
    push QWORD [rbp + 16]
    call _stringLength
    add rsp, 8
    push r14
    mov rax, 1
    mov rdi, 1
    mov rsi, [rbp + 16]
    mov rdx, [rbp - 8]
    syscall
        mov rsp, rbp
    pop rbp
    ret
label2:
    jmp label3
_fromBool:
    push rbp
    mov rbp, rsp
    mov rax, QWORD [rbp + 16]
    test rax, rax
    jz label4
    push rbp
    mov rbp, rsp
    mov rax, ident0
    mov r14, rax
    mov rsp, rbp
    pop rbp
    jmp label5
label4:
    push rbp
    mov rbp, rsp
    mov rax, ident1
    mov r14, rax
    mov rsp, rbp
    pop rbp
label5:
    mov rsp, rbp
    pop rbp
    ret
label3:
    jmp label6
_stringCopy:
    push rbp
    mov rbp, rsp
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
    mov rsp, rbp
    pop rbp
    ret
label6:
    jmp label7
_concat:
    push rbp
    mov rbp, rsp
    push QWORD [rbp + 24]
    call _stringLength
    add rsp, 8
    push r14
    push QWORD [rbp + 16]
    call _stringLength
    add rsp, 8
    push r14
    push QWORD [rbp + -8]
    mov rbx, QWORD [rbp + -16]
    pop rax
    add rax, rbx
    push rax
    mov rbx, 1
    pop rax
    add rax, rbx
    push rax
    call _malloc
    add rsp, 8
    push r14
    push QWORD [rbp + 24]
    push QWORD [rbp + -24]
    call _stringCopy
    add rsp, 16
    push r14
    push QWORD [rbp + 16]
    push QWORD [rbp + -24]
    mov rbx, QWORD [rbp + -8]
    pop rax
    add rax, rbx
    push rax
    call _stringCopy
    add rsp, 16
    push r14
    mov r14, QWORD [rbp + -24]
    mov rsp, rbp
    pop rbp
    ret
label7:
    mov rax, ident2
    push rax
    mov rax, ident3
    push rax
    push QWORD [rbp + -8]
    push QWORD [rbp + -16]
    call _concat
    add rsp, 16
    push r14
    push QWORD [rbp + -24]
    call _println
    add rsp, 8
    push r14
    mov rax, 60
    mov rdi, 0
    syscall

; routines
