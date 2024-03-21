import axios from "axios";

export async function execute(source: string) {
    const result = await axios.post(
        "https://godbolt.org/api/compiler/nasm21601/compile",
        {
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
    );

    console.log("Standard Output:");
    console.log(
        ...result.data.execResult.stdout.map((text) => {
            return text.text;
        }),
    );
    console.log(
        "Standard Error: ",
        ...result.data.execResult.stderr.map((text) => {
            return text.text;
        }),
    );
    console.log("Exit Code: " + result.data.execResult.code);
    return {
        exitCode: result.data.execResult.code,
        standardOut: result.data.execResult.stdout,
        standardErr: result.data.execResult.stderr,
    };
}
