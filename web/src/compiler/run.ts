import { compile } from "../../../compiler/src/compiler.ts";
import { execute } from "../../../compiler/src/assemble.ts";
export async function run(source: string) {
    const asm = compile(source, false, "run.ejo");
    return await execute(asm);
}
