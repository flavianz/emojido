import { compile } from "../../../compiler/src/compiler.ts";
import ky from "ky";

async function execute(source: string) {
    const result = (await ky
        .post("https://godbolt.org/api/compiler/nasm21601/compile", {
            json: {
                allowStoreDebug: true,
                bypassCache: 0,
                compiler: "nasm21601",
                files: [],
                lang: "assembly",
                source: source,
                options: {
                    userArguments: "-felf64",
                    compilerOptions: {
                        producePp: null,
                        produceGccDump: {},
                        produceOptInfo: false,
                        produceCfg: false,
                        produceIr: null,
                        produceOptPipeline: null,
                        produceDevice: false,
                        overrides: [],
                    },
                    filters: {
                        binaryObject: false,
                        binary: false,
                        execute: true,
                        intel: true,
                        demangle: true,
                        labels: true,
                        directives: true,
                        commentOnly: true,
                        trim: false,
                        debugCalls: false,
                    },
                    tools: [],
                    libraries: [],
                    executeParameters: {
                        args: "",
                        stdin: "",
                    },
                },
            },
        })
        .json()) as {
        execResult: {
            stdout: { text: string }[];
            stderr: { text: string }[];
            code: number;
        };
    };

    if (!result) {
        console.log("Error while running asm");
    }
    if (!result.execResult) {
        console.log("Error while running asm");
    }
    console.log("Standard Output:");
    console.log(
        ...result.execResult.stdout.map((text) => {
            return text.text;
        }),
    );
    console.log(
        "Standard Error: ",
        ...result.execResult.stderr.map((text) => {
            return text.text;
        }),
    );
    console.log("Exit Code: " + result.execResult.code);
    return {
        exitCode: result.execResult.code,
        standardOut: result.execResult.stdout,
        standardErr: result.execResult.stderr,
    };
}

export async function run(source: string) {
    const asm = compile(source, false, "run.ejo");
    return await execute(asm);
}
