export const math =
    "let e = 2.7182818284590;\n" +
    "\n" +
    "let pi = 3.1415926535897;\n" +
    "\n" +
    "function float abs function float absInput {\n" +
    "    if absInput < 0 if {\n" +
    "        return absInput * -1;\n" +
    "    }\n" +
    "    else {\n" +
    "        return absInput;\n" +
    "    }\n" +
    "}\n" +
    "\n" +
    "function float mod function float dividend float divisor {\n" +
    "    while dividend >= divisor while {\n" +
    "        dividend minusequal divisor;\n" +
    "    }\n" +
    "    return dividend;\n" +
    "}\n" +
    "\n" +
    "\n" +
    "function int round function float roundInput {\n" +
    "    return int roundInput + 0.00000001;\n" +
    "}\n" +
    "\n" +
    "function int floor function float floorInput {\n" +
    "    return round call floorInput minus 0.5 call;\n" +
    "}\n" +
    "\n" +
    "function int ceil function float ceilInput {\n" +
    "    return round call ceilInput + 0.5 call;\n" +
    "}\n" +
    "\n" +
    "\n" +
    "function int factorial function int factorialInput {\n" +
    "    if factorialInput == 0 || factorialInput == 1 if\n" +
    "    {\n" +
    "        return 1;\n" +
    "    }\n" +
    "    elseif factorialInput == -1 elseif {\n" +
    "        return -1;\n" +
    "    }\n" +
    "    else {\n" +
    "        let result = 1;\n" +
    "        let isNeg = factorialInput < 0;\n" +
    "        factorialInput = round call abs call float factorialInput call call;\n" +
    "        for let i = 2; i <= factorialInput; i++; for {\n" +
    "            result *= i;\n" +
    "        }\n" +
    "        if isNeg if {\n" +
    "            return result * -1;\n" +
    "        }\n" +
    "        else\n" +
    "        {\n" +
    "            return result;\n" +
    "        }\n" +
    "    }\n" +
    "}\n" +
    "\n" +
    "function float exp function float expInput {\n" +
    "    let epsilon = 0.000000001;\n" +
    "    let term = float 1;\n" +
    "    let sum = float 1;\n" +
    "    let n = 1;\n" +
    "    while abs call term call > epsilon while {\n" +
    "        term *= expInput / n;\n" +
    "        sum += term;\n" +
    "        n++;\n" +
    "    }\n" +
    "    return sum;\n" +
    "}\n" +
    "\n" +
    "function float loge function float logeInput {\n" +
    "    if logeInput <= 0 if {\n" +
    "        return float 0;\n" +
    "    } else{\n" +
    "        let epsilon = 0.0000000001;\n" +
    "        let term = (logeInput minus 1) / (logeInput + 1);\n" +
    "        let sum = term;\n" +
    "        let power = term;\n" +
    "        let n = 3;\n" +
    "        while abs call power call > epsilon while {\n" +
    "            power *= term * term;\n" +
    "            sum += power / n;\n" +
    "            n += 2;\n" +
    "        }\n" +
    "        return 2 * sum;\n" +
    "    }\n" +
    "}\n" +
    "\n" +
    "function float pow function float base float exponent {\n" +
    "    if exponent == 0.0 if {\n" +
    "        return 1.0;\n" +
    "    } elseif exponent == 1.0 elseif {\n" +
    "        return base;\n" +
    "    } elseif exponent < 0 elseif {\n" +
    "        return 1 / pow call base, -1 * exponent call;\n" +
    "    } elseif base == 0.0 elseif {\n" +
    "        return 0.0;\n" +
    "    } else {\n" +
    "        return exp call exponent * loge call base call call;\n" +
    "    }\n" +
    "}\n" +
    "\n" +
    "function float max function float maxInput1 float maxInput2 {\n" +
    "    if maxInput1 > maxInput2 if {\n" +
    "        return maxInput1;\n" +
    "    } else {\n" +
    "        return maxInput2;\n" +
    "    }\n" +
    "}\n" +
    "function float min function float minInput1 float minInput2 {\n" +
    "    if minInput1 < minInput2 if {\n" +
    "        return minInput1;\n" +
    "    } else {\n" +
    "        return minInput2;\n" +
    "    }\n" +
    "}\n" +
    "\n" +
    "function float sin function float sinAngle  {\n" +
    "    let terms = 10;\n" +
    "    sinAngle = sinAngle * 3.1415926535897 / 180;\n" +
    "    let result = 0.0;\n" +
    "    for let i = 0; i < terms; i++; for {\n" +
    "        let coefficient = 0;\n" +
    "        if mod call float i, 2.0 call == 0.0 if {\n" +
    "            coefficient = 1;\n" +
    "        } else {\n" +
    "            coefficient = -1;\n" +
    "        }\n" +
    "        let sinExponent = 2 * i + 1;\n" +
    "        result += coefficient * (pow call sinAngle, float sinExponent call) / (factorial call sinExponent call);\n" +
    "    }\n" +
    "    return result;\n" +
    "}\n" +
    "function float cos function float cosAngle  {\n" +
    "    let terms = 10;\n" +
    "    cosAngle = cosAngle * 3.1415926535897 / 180;\n" +
    "    let result = 0.0;\n" +
    "    for let i = 0; i < terms; i++; for {\n" +
    "        let coefficient = 0;\n" +
    "        if mod call float i, 2.0 call == 0.0 if {\n" +
    "            coefficient = 1;\n" +
    "        } else {\n" +
    "            coefficient = -1;\n" +
    "        }\n" +
    "        let cosExponent = 2 * i;\n" +
    "        result += coefficient * (pow call cosAngle, float cosExponent call) / (factorial call cosExponent call);\n" +
    "    }\n" +
    "    return result;\n" +
    "}\n" +
    "\n" +
    "function float tan function float tanAngle {\n" +
    "    let sinVal = sin call tanAngle call;\n" +
    "    let cosVal = cos call tanAngle call;\n" +
    "    return sinVal / cosVal;\n" +
    "}\n" +
    "\n" +
    "function float sqrt function float sqrtValue float sqrtBase {\n" +
    "    if (sqrtValue < 0 || sqrtBase <= 1) if {\n" +
    "        return 0.0;\n" +
    "    }\n" +
    "    let epsilon = 0.00001;\n" +
    "    let minVal = 0.0;\n" +
    "    let maxVal = sqrtValue;\n" +
    "    let guess = (minVal + maxVal) / 2;\n" +
    "    while (maxVal minus minVal) > epsilon while\n" +
    "    {\n" +
    "        let powed = pow call guess, sqrtBase call;\n" +
    "        if powed < sqrtValue if {\n" +
    "            minVal = guess;\n" +
    "        } elseif powed > sqrtValue elseif {\n" +
    "            maxVal = guess;\n" +
    "        } else {\n" +
    "            return guess;\n" +
    "        }\n" +
    "        guess = (minVal + maxVal) / 2;\n" +
    "    }\n" +
    "\n" +
    "    return guess;\n" +
    "}\n" +
    "\n" +
    "\n" +
    "function float logx function float logxNumber float logxBase {\n" +
    "    if logxNumber <= 0 || logxBase <= 0 || logxBase == 1.0 if {\n" +
    "        return 0.0;\n" +
    "    }\n" +
    "\n" +
    "    return loge call logxNumber call / loge call logxBase call;\n" +
    "}\n" +
    "\n" +
    "function float log2 function float logValue {\n" +
    "        return logx call logValue, 2.0 call;\n" +
    "}\n" +
    "\n" +
    "\n" +
    "function float log10 function float logValue {\n" +
    "    return logx call logValue, 10.0 call;\n" +
    "}\n";

export const str =
    'import "sys";\n' +
    'import "math";\n' +
    "\n" +
    "function int stringLength function string input {\n" +
    '    asm "    mov rdi, [rbp + 16]\n' +
    "    xor eax, eax\n" +
    "    pxor xmm0, xmm0\n" +
    ".loop:\n" +
    "    movdqu xmm1, [rdi + rax]\n" +
    "    pcmpeqb xmm1, xmm0\n" +
    "    pmovmskb ecx, xmm1\n" +
    "    lea rax, [eax + 16]\n" +
    "    test ecx, ecx\n" +
    "    jz .loop\n" +
    "    bsf ecx, ecx\n" +
    "    lea rax, [rax + rcx - 16]\n" +
    "    mov r14, rax\n" +
    '";\n' +
    "}\n" +
    "\n" +
    "\n" +
    "\n" +
    "function string fromBool function bool input {\n" +
    "    if input if {\n" +
    '        return "true";\n' +
    "    } else {\n" +
    '        return "false";\n' +
    "    }\n" +
    "}\n" +
    "\n" +
    "function pointer stringCopy function pointer src pointer dest {\n" +
    '    asm "    mov rdi, [rbp + 16]\n' +
    "    mov rsi, [rbp + 24]\n" +
    "    cmp\tdi, 0\n" +
    "    je strcpy_done\n" +
    "    cmp\trsi, 0\n" +
    "    je strcpy_done\n" +
    "    mov rcx, -1\n" +
    "strcpy_loop:\n" +
    "    inc\trcx\n" +
    "    mov\tal, byte [rsi + rcx]\n" +
    "    mov\tbyte [rdi + rcx], al\n" +
    "    cmp\tal, 0\n" +
    "    jne\tstrcpy_loop\n" +
    "strcpy_done:\n" +
    "    mov\tr14, rdi\n" +
    '";\n' +
    "}\n" +
    "\n" +
    "function string concat function string prefix string suffix {\n" +
    "    let prefixLength = stringLength call prefix call;\n" +
    "    let suffixLength = stringLength call suffix call;\n" +
    "    let point = malloc call prefixLength + suffixLength + 1 call;\n" +
    "    stringCopy call prefix, point call;\n" +
    "    stringCopy call suffix, point + prefixLength call;\n" +
    "    free call prefixLength + suffixLength + 1 call;\n" +
    "    return string point;\n" +
    "}\n" +
    "\n" +
    "function null println function string input {\n" +
    "    let length = stringLength call input call;\n" +
    '    asm "    mov rax, 1\n' +
    "    mov rdi, 1\n" +
    "    mov rsi, [rbp + 16]\n" +
    "    mov rdx, [rbp - 8]\n" +
    "    syscall\n" +
    "    mov rax, 1\n" +
    "    mov rsi, newline\n" +
    "    mov rdx, 1\n" +
    "    syscall\n" +
    '", "    newline db 10\n' +
    '";\n' +
    "}\n" +
    "\n" +
    "function string fromInt function int number {\n" +
    '    let result = "";\n' +
    "    if number == 0 if {\n" +
    '        return "0";\n' +
    "    } else {\n" +
    "        let isNeg = false;\n" +
    "        if number < 0 if {\n" +
    "            isNeg = true;\n" +
    "            number = -1 * number;\n" +
    "        }\n" +
    "        while number > 0 while {\n" +
    "            let val = int mod call float number, 10.0 call + 48; //used in asm\n" +
    '            let stringified = " "; // used in asm\n' +
    '            asm "    mov r13, [rbp - 8]\n' +
    "    mov qword rax, qword [rbp - 16]\n" +
    "    mov [rax], r13\n" +
    '"; //moves the ascii value calculated above into stringified\n' +
    "            result = concat call stringified, result call;\n" +
    "            let divided = int number / 10.0;\n" +
    "            number = floor call number / 10.0 call;\n" +
    "        }\n" +
    "\n" +
    "        if isNeg if {\n" +
    '            result = concat call "-", result call;\n' +
    "        }\n" +
    "        return result;\n" +
    "    }\n" +
    "}\n" +
    "\n" +
    "function string fromFloat function float number {\n" +
    '    let prefix = "";\n' +
    "    if number < 0 if {\n" +
    '        prefix = "-";\n' +
    "    }\n" +
    "    number = abs call number call;\n" +
    "    let integralPart = floor call number call;\n" +
    "    let fractionalPart = number minus integralPart;\n" +
    "\n" +
    '    let integralString = "";\n' +
    '    let fractionalString = "";\n' +
    "    if integralPart == 0 if{\n" +
    '        integralString = "0";\n' +
    "    } else {\n" +
    "        while integralPart > 0 while {\n" +
    "            let val = int mod call float integralPart, 10.0 call + 48; //used in asm\n" +
    '            let char = " ";\n' +
    '            asm "    mov r13, [rsp + 8]\n' +
    "    mov qword rax, qword [rsp]\n" +
    "    mov [rax], r13\n" +
    '"; //moves the ascii value calculated above into stringified\n' +
    "            integralString = concat call char, integralString call;\n" +
    "            integralPart = floor call integralPart / 10 call;\n" +
    "        }\n" +
    "    }\n" +
    "    if fractionalPart != 0.0 if {\n" +
    '        fractionalString = ".";\n' +
    "        while fractionalPart > 0.00001 while {\n" +
    "\n" +
    "            fractionalPart *= 10;\n" +
    "            let digit = floor call fractionalPart call + 48;\n" +
    '            let char = " ";\n' +
    '            asm "    mov r13, [rsp + 8]\n' +
    "    mov qword rax, qword [rsp]\n" +
    "    mov [rax], r13\n" +
    '"; //moves the ascii value calculated above into stringified\n' +
    "            fractionalString = concat call fractionalString, char call;\n" +
    "            fractionalPart minusequal digit minus 48;\n" +
    "        }\n" +
    "    }\n" +
    "    let combined = concat call integralString, fractionalString call;\n" +
    "    return concat call prefix, combined call;\n" +
    "}";
export const sys =
    "function int getUnix function {\n" +
    '    asm "    mov rax, 201\n' +
    "    xor rdi, rdi\n" +
    "    syscall\n" +
    "    mov rdi, 1000\n" +
    "    mul rdi\n" +
    "    mov r14, rax\n" +
    '";\n' +
    "}\n" +
    "\n" +
    "function pointer malloc function int bytes {\n" +
    '    asm "    mov rsi, [rbp + 16]\n' +
    "    xor rdi, rdi\n" +
    "    mov rdx, 0x07\n" +
    "    mov r10, 0x22\n" +
    "    mov r8, -1\n" +
    "    mov r9, 0\n" +
    "    mov rax, 9\n" +
    "    syscall\n" +
    "    mov r14, rax\n" +
    '";\n' +
    "}\n" +
    "\n" +
    "function null free function int size {\n" +
    '    asm "    mov rsi, [rbp + 16]\n' +
    "    mov rdi, rax\n" +
    "    mov rax, 11\n" +
    "    syscall\n" +
    "    mov r14, 0\n" +
    '";\n' +
    "}";
