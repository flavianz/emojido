global _start
_start:
    mov rax, 3
    push rax
    mov rax, 0
    push rax
    push QWORD [rsp + 8]
    pop rax
    pop rbx
    cmp rax, rbx
    setnz al
    push rax
    pop rax
    test rax, rax
    jz label0
    mov rax, 1
    push rax
    mov rax, 60
    pop rdi
    syscall
    add rsp, 0
    jmp label1
label0:
    mov rax, 1
    push rax
    push QWORD [rsp + 8]
    pop rax
    pop rbx
    cmp rax, rbx
    setz al
    push rax
    pop rax
    test rax, rax
    jz label2
    mov rax, 2
    push rax
    mov rax, 60
    pop rdi
    syscall
    add rsp, 0
    jmp label1
label2:
    mov rax, 2
    push rax
    push QWORD [rsp + 8]
    pop rax
    pop rbx
    cmp rax, rbx
    setz al
    push rax
    pop rax
    test rax, rax
    jz label3
    mov rax, 3
    push rax
    mov rax, 60
    pop rdi
    syscall
    add rsp, 0
    jmp label1
label3:
    mov rax, 4
    push rax
    mov rax, 60
    pop rdi
    syscall
    add rsp, 0
label1:
    mov rax, 60
    mov rdi, 0
    syscall
