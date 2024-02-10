section .data
    ident0 db "Hello, World!ssefwsefsdvsae er fwerihvbiu bqiwueb fiuwv fiuaeofuhaboihjbawouehb fowuehb fouwevf uiewvf 9ouhewvf uiqwv eifuqvhw efuohqvwe oufhoqweff", 0ah

section .text
    global _start
_start:
    mov rax, ident0
    push rax
    push QWORD [rsp + 0]
    mov rax, 1
    mov rdi, 1
    pop rsi
    xor rcx, rcx
__calc_length_loop:
    cmp byte [rsi + rcx], 0
    je __calc_length_done
    inc rcx
    jmp __calc_length_loop
__calc_length_done:
    mov rdx, rcx
    syscall
    mov rax, 60
    mov rdi, 0
    syscall
