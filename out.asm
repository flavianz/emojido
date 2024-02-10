global _start
_start:
    mov rax, 1
    push rax
    mov rax, 1
    push rax
    pop rax
    pop rbx
    xor rax, rbx
    push rax
    pop rax
    test rax, rax
    jz label0
    mov rax, 16
    push rax
    mov rax, 60
    pop rdi
    syscall
    add rsp, 0
    jmp label1
label0:
    mov rax, 18
    push rax
    mov rax, 60
    pop rdi
    syscall
    add rsp, 0
label1:
    mov rax, 60
    mov rdi, 0
    syscall
