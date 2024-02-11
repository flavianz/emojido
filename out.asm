section .data
    _float_1 dq 0.0
    _float_2 dq 0.0
section .bss
    _digitSpace resb 100
    _digitSpacePos resb 8

section .text
    global _start
_start:
    mov rax, 1
    push rax
    mov rax, 3
    push rax
    pop rbx
    pop rax
    mul rbx
    push rax
    push QWORD [rsp + 0]
    pop rax
    call __printInt
    mov rax, 60
    mov rdi, 0
    syscall
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
