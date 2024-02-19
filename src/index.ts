import { compile } from "./compiler";
import fs from "node:fs";
import { execute } from "./assemble";
const sourceFile = process.argv[2];

if (!sourceFile) {
    throw new Error("Wrong usage: <source.ejo> <?out.asm>");
}

const outFile = process.argv[3] ?? "./out.asm";

const source = fs.readFileSync(sourceFile);

const asm = compile(source.toString());

fs.writeFileSync(outFile, asm);

execute(asm);
