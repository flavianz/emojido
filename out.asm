section .data
    ident0 db "sm2", 0ah
    ident1 db "greater than 0", 0ah
section .bss

section .text
    global _start
_start:
    mov rax, 2
    push rax
    push QWORD [rsp + 0]
    mov rax, 1
    push rax
    pop rbx
    pop rax
    cmp rax, rbx
    setg al
    push rax
    pop rax
    test rax, rax
    jz label0
    push QWORD [rsp + 0]
    mov rax, 2
    push rax
    pop rbx
    pop rax
    cmp rax, rbx
    setz al
    pop rax
    pop rax
    test rax, rax
    jz label1
    mov rax, ident0
    push rax
    mov rax, 1
    mov rdi, 1
    pop rsi
    xor rcx, rcx
    mov rdx, rcx
    syscall
    add rsp, 0
    jmp label2
label1:
    mov rax, ident1
    push rax
    mov rax, 1
    mov rdi, 1
    pop rsi
    xor rcx, rcx
    mov rdx, rcx
    syscall
    add rsp, 0
label2:
    mov rax, 2
    push rax
    mov rax, 60
    pop rdi
    syscall
    add rsp, 0
    jmp label3
label0:
    push QWORD [rsp + -16]
    mov rax, 1
    push rax
    pop rbx
    pop rax
    cmp rax, rbx
    setle al
    push rax
    pop rax
    test rax, rax
    jz label4
    mov rax, 24
    push rax
    mov rax, 60
    pop rdi
    syscall
    add rsp, 0
    jmp label3
label4:
    mov rax, 69
    push rax
    mov rax, 60
    pop rdi
    syscall
    add rsp, 0
label3:
    mov rax, 60
    mov rdi, 0
    syscall
__calc_string_length:
    cmp byte [rsi + rcx], 0
    je __calc_string_length_return
    inc rcx
    jmp __calc_string_length
__calc_string_length_return:
    ret