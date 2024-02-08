import { NodeExit } from "./types";

export class Generator {
    private readonly root: NodeExit;
    constructor(root: NodeExit) {
        this.root = root;
    }

    /** Generate asm from the token array
     * @returns {string} the asm
     * */
    generate(): string {
        let output = "global _start\n_start:\n";
        output += "    mov rax, 60\n";
        output += `    mov rdi, ${this.root.expr.int_lit.value}\n`;
        output += "    syscall\n";

        return output;
    }
}
