global _start
_start:
    mov rax, 0
    push rax
    pop rax
    test rax, rax
    jz label0
    mov rax, 9
    push rax
    mov rax, 60
    pop rdi
    syscall
    add rsp, 0
label0:
    mov rax, 0
    push rax
    pop rax
    test rax, rax
    jz label2
    mov rax, 10
    push rax
    mov rax, 60
    pop rdi
    syscall
    add rsp, 0
    jmp label1
label2:
    mov rax, 11
    push rax
    mov rax, 60
    pop rdi
    syscall
    add rsp, 0
label1:
    mov rax, 60
    mov rdi, 0
    syscall
