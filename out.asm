section .data
section .bss
section .text
    global _start
_start:
    mov rax, 3
    push rax
    mov rax, 5
    push rax
    pop rbx
    pop rcx
    mov rax, 1
    jmp __pow
__pow:
    cmp rbx, 0
    jle __pow_end
    mul rcx
    dec rbx
    jmp __pow
__pow_end:
    push rax
    mov rax, 60
    pop rdi
    syscall
    mov rax, 60
    mov rdi, 0
    syscall
