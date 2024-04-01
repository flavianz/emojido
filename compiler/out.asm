section .data
    ident0 db "Hello, World", 0
section .bss

section .text
    global _start
_start:
    mov rbp, rsp
    mov rsi, ident0
    mov rdi, rsi
    call calc_string_length
    mov rdx, rax
    mov rax, 1
    mov rdi, 1
    syscall
    mov rax, 60
    mov rdi, 0
    syscall

; routines
calc_string_length:
    xor       eax, eax
    pxor      xmm0, xmm0
.loop:
    movdqu    xmm1, [rdi + rax]
    pcmpeqb   xmm1, xmm0
    pmovmskb  ecx, xmm1
    lea       eax, [eax + 16]
    test      ecx, ecx
    jz        .loop
    bsf       ecx, ecx
    lea       rax, [rax + rcx - 16]
    ret
