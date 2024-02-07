import {tokenize} from "./tokenization";
import {demoji} from "./demoji";
import {generate} from "./generator";
import * as fs from "node:fs"

/**compile emojido source code to nasm asm
 *
 * @param {string} source the source code
 * @returns {string} the asm
 * */
export function compile(source: string): string
{
    source = demoji(source)

    const tokens = tokenize(source)

    const asm = generate(tokens)

    console.log(asm)

    fs.writeFileSync("C:\\Users\\flavi\\Documents\\WebProjects\\emojido\\out.asm", asm)

    return asm
}