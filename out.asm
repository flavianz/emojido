section .data
    _float_1 dq 0.0
    _float_2 dq 0.0
section .bss
section .text
    global _start
_start:
    mov rax, 1
    push rax
    mov rax, 1
    push rax
    pop rbx
    pop rax
    add rax, rbx
    push rax
    push QWORD [rsp + 0]
    mov rax, 60
    pop rdi
    syscall
    mov rax, 60
    mov rdi, 0
    syscall
