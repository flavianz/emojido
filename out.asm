section .data
    ident0 db "a", 0ah
    ident1 db "c", 0ah
section .bss
section .text
    global _start
_start:
    mov rax, ident0
    push rax
    mov rax, 1
    push rax
    mov rax, ident1
    push rax
    mov rax, 2
    push rax
    pop rax
    mov [rsp + 8], rax
    push QWORD [rsp + 8]
    mov rax, 60
    pop rdi
    syscall
    mov rax, 60
    mov rdi, 0
    syscall
