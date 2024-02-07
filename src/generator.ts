import {Token, TokenType} from "./types";

/** Generate asm from the token array
 * @param {Token[]} tokens the to be generated tokens
 * @returns {string} the asm
 * */
export function generate(tokens: Token[]): string
{
    let output = "global _start\n_start:\n";
    for(let i = 0; i < tokens.length; i++)
    {
        const token = tokens[i]
        if(token.type === TokenType.exit)
        {
            if(i + 1 < tokens.length && tokens[i + 1].type === TokenType.int_lit)
            {
                if(i + 2 < tokens.length && tokens[i + 2].type === TokenType.semi)
                {
                    output += "    mov rax, 60\n"
                    output += `    mov rdi, ${tokens[i + 1].value}\n`
                    output += "    syscall\n"
                }
            }
        }
    }

    return output;
}