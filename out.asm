global _start
_start:
    mov rax, 2
    push rax
    mov rax, 3
    push rax
    mov rax, 2
    push rax
    pop rax
    pop rbx
    mul rbx
    push rax
    mov rax, 10
    push rax
    pop rax
    pop rbx
    sub rax, rbx
    push rax
    pop rax
    pop rbx
    div rbx
    push rax
    mov rax, 0
    push rax
    pop rax
    test rax, rax
    jz label0
    push QWORD [rsp + 0]
    mov rax, 60
    pop rdi
    syscall
    add rsp, 0
label0:
    mov rax, 60
    mov rdi, 0
    syscall
