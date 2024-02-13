section .data
section .bss
    _digitSpace resb 100
    _digitSpacePos resb 8

section .text
    global _start
_start:
    ; start let statement
    ; binary multiply
    mov rax, 2 ; generate term integer
    push rax
    ; binary subtract
    mov rax, 100 ; generate term integer
    push rax
    ; binary multiply
    ; binary multiply
    mov rax, 1 ; generate term integer
    push rax
    ; binary multiply
    mov rax, 3 ; generate term integer
    push rax
    mov rax, 3 ; generate term integer
    push rax
    pop rbx
    pop rax
    mul rbx
    push rax
    pop rbx
    pop rax
    mul rbx
    push rax
    mov rax, 7 ; generate term integer
    push rax
    pop rbx
    pop rax
    mul rbx
    push rax
    pop rbx
    pop rax
    sub rax, rbx
    push rax
    pop rbx
    pop rax
    mul rbx
    push rax
    ; start print statement
    push QWORD [rsp + 0] ; generate term from identifier
    pop rax
    call __printInt
    mov rax, 60
    mov rdi, 0
    syscall

    ; routines
__printInt:
    mov rcx, _digitSpace
    mov rbx, 10
    mov [rcx], rbx
    inc rcx
    mov [_digitSpacePos], rcx
__printIntLoop:
    mov rdx, 0
    mov rbx, 10
    div rbx
    push rax
    add rdx, 48
    mov rcx, [_digitSpacePos]
    mov [rcx], dl
    inc rcx
    mov [_digitSpacePos], rcx
    pop rax
    cmp rax, 0
    jne __printIntLoop
__printIntLoop2:
    mov rcx, [_digitSpacePos]
    mov rax, 1
    mov rdi, 1
    mov rsi, rcx
    mov rdx, 1
    syscall
    mov rcx, [_digitSpacePos]
    dec rcx
    mov [_digitSpacePos], rcx
    cmp rcx, _digitSpace
    jge __printIntLoop2
    ret
