section .data
    ; Define variables
    array_ptr       dq  0         ; Pointer to the dynamically allocated array
    array_capacity  dq  0         ; Capacity of the array (number of elements it can hold)
    array_size      dq  0         ; Current size of the array (number of elements)

section .text
    global _start

_start:
    ; Allocate initial memory for the array
    mov     rdi, 0              ; any non-zero value
    mov     rax, 9              ; sys_mmap
    xor     rsi, rsi            ; address hint (let the kernel choose)
    mov     rdx, 4096           ; size of the memory to allocate (initially 1 page)
    mov     r10, 0x22           ; PROT_READ | PROT_WRITE | MAP_PRIVATE
    mov     r8, -1              ; file descriptor (ignored for anonymous mappings)
    mov     r9, 0               ; offset (ignored for anonymous mappings)
    syscall
    mov     qword [array_ptr], rax
    mov     qword [array_capacity], 1

    ; Your code continues here

    ; For demonstration, let's push some elements into the array
    ; (This would be replaced with your actual logic)

    ; Push 10 elements into the array
    mov     rdi, 10             ; Number of elements to push
    call    push_elements

    mov     qword [array_ptr], 17      ; Write the new value at the end of the array

    ; Increment array size
    inc     qword [array_size]


    mov rdi, qword [array_ptr + 0]

    ; Exit the program
    mov     rax, 60
    syscall

push_elements:
    ; Arguments:
    ; rdi: Number of elements to push

    ; Check if there is enough capacity for the new elements
    mov     rax, [array_size]       ; Get current size
    add     rax, rdi                ; Calculate new size after pushing elements
    cmp     rax, [array_capacity]   ; Compare with capacity
    jle     enough_capacity         ; Jump if there is enough capacity

    ; Need to allocate more memory
    mov     rax, [array_capacity]   ; Get current capacity
    shl     rax, 1                  ; Double the capacity
    mov     rcx, rax                ; Store new capacity
    imul    rax, rdx, 8             ; Calculate new size in bytes
    mov     rdi, 0                  ; any non-zero value
    mov     rdx, rax                ; size of the memory to allocate
    mov     r10, 0x22               ; PROT_READ | PROT_WRITE | MAP_PRIVATE
    mov     r8, -1                  ; file descriptor (ignored for anonymous mappings)
    mov     r9, 0                   ; offset (ignored for anonymous mappings)
    syscall
    mov     rsi, rax                ; Store new memory address
    mov     rax, [array_ptr]        ; Get old memory address
    mov     rcx, [array_size]       ; Get current size
    shl     rcx, 3                  ; Convert size to bytes
    mov     rdx, rcx                ; Number of bytes to copy
    mov     rdi, rsi                ; Destination address
    rep     movsq                   ; Copy data
    mov     qword [array_ptr], rsi  ; Update array pointer
    mov     qword [array_capacity], rcx  ; Update array capacity

enough_capacity:
    ; Increment array size
    add     qword [array_size], rdi

    ret
