import { Tokenizer } from "./tokenization";
import { demoji } from "./demoji";
import { Parser } from "./parser";
import { Generator } from "./generator";
import { assemblify, Optimizer } from "./optimizer";

/**compile emojido source code to nasm asm
 *
 * @param {string} source the source code
 * @param debug
 * @returns {string} the asm
 * */
export function compile(source: string, debug: boolean): string {
    const start = Date.now();

    source = demoji(source);
    const tokenizer = new Tokenizer(source);
    const tokens = tokenizer.tokenize();

    const parser = new Parser(tokens);
    const program = parser.parseProgram();

    const generator = new Generator(program);
    const asm = generator.generateProgram();

    let assemblyTokens = asm.text;

    if (!debug) {
        const optimizer = new Optimizer(assemblyTokens);
        assemblyTokens = optimizer.optimize();
    }

    const text = assemblify(assemblyTokens);

    console.log(
        `Compiled in ${Date.now() - start} ms\nFetching execution results...\n\n`,
    );

    return (
        "section .data\n" +
        asm.data +
        "section .bss\n" +
        asm.bss +
        "\nsection .text\n    global _start\n_start:\n" +
        text +
        asm.routines
    );
}
