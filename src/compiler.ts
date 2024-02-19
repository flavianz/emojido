import { Tokenizer } from "./tokenization";
import { demoji } from "./demoji";
import { Parser } from "./parser";
import { Generator } from "./generator";

/**compile emojido source code to nasm asm
 *
 * @param {string} source the source code
 * @returns {string} the asm
 * */
export function compile(source: string): string {
    const start = Date.now();

    source = demoji(source);
    const tokenizer = new Tokenizer(source);
    const tokens = tokenizer.tokenize();

    const parser = new Parser(tokens);
    const program = parser.parseProgram();

    const generator = new Generator(program);
    const asm = generator.generateProgram();

    console.log(
        `Compiled in ${Date.now() - start} ms\nFetching execution results...\n\n`,
    );

    return asm;
}
