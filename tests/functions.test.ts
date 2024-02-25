import { compile } from "../src/compiler";
import { execute } from "../src/assemble";

describe("Compiler", () => {
    it("exits", async () => {
        const result = await execute(compile("🚪21🚀", false));
        expect(result.exitCode).toBe(21);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("prints strings", async () => {
        const result = await execute(compile("🖨️🔠Hello, World!🔠🚀", false));
        expect(result.exitCode).toBe(0);
        expect(result.standardOut).toEqual([{ text: "Hello, World!" }]);
        expect(result.standardErr).toEqual([]);
    });
    it("prints integers", async () => {
        const result = await execute(compile("🖨️69🚀", false));
        expect(result.exitCode).toBe(0);
        expect(result.standardOut).toEqual([{ text: "\u000069" }]);
        expect(result.standardErr).toEqual([]);
    });
    it("prints integers", async () => {
        const result = await execute(compile("🖨️69🚀", false));
        expect(result.exitCode).toBe(0);
        expect(result.standardOut).toEqual([{ text: "\u000069" }]);
        expect(result.standardErr).toEqual([]);
    });
    it("prints booleans", async () => {
        const result = await execute(compile("🖨️✅🚀", false));
        expect(result.exitCode).toBe(0);
        expect(result.standardOut).toEqual([{ text: "true" }]);
        expect(result.standardErr).toEqual([]);
    });
    it("defines variables", async () => {
        const result = await execute(compile("📦x🪢17🚀🚪x🚀", false));
        expect(result.exitCode).toBe(17);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("reassigns variables", async () => {
        const result = await execute(compile("📦x🪢17🚀x🪢69🚀🚪x🚀", false));
        expect(result.exitCode).toBe(69);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("adds", async () => {
        const result = await execute(compile("🚪5➕3🚀", false));
        expect(result.exitCode).toBe(8);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("subtracts", async () => {
        const result = await execute(compile("🚪5➖3🚀", false));
        expect(result.exitCode).toBe(2);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("multiplies", async () => {
        const result = await execute(compile("🚪5✖️3🚀", false));
        expect(result.exitCode).toBe(15);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("divides", async () => {
        const result = await execute(compile("📦x🪢5➗2🚀🚪0🚀", false));
        expect(result.exitCode).toBe(0);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("executes shorthand math", async () => {
        const result = await execute(
            compile("📦x🪢5🚀x➕🪢5🚀x✖️🪢5🚀x➖🪢5🚀🚪x🚀", false),
        );
        expect(result.exitCode).toBe(45);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("executes if-statements", async () => {
        const result = await execute(compile("✂️✅✂️⚽🚪10🚀🥅", false));
        expect(result.exitCode).toBe(10);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("executes else-statements", async () => {
        const result = await execute(
            compile("✂️❌✂️⚽🚪10🚀🥅🗑️⚽🚪11🚀🥅", false),
        );
        expect(result.exitCode).toBe(11);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("executes elseif-statements", async () => {
        const result = await execute(
            compile("✂️❌✂️⚽🚪9🚀🥅📐✅📐⚽🚪10🚀🥅🗑️⚽🚪11🚀🥅", false),
        );
        expect(result.exitCode).toBe(10);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("compares", async () => {
        const result = await execute(
            compile("✂️❌✂️⚽🚪9🚀🥅📐✅📐⚽🚪10🚀🥅🗑️⚽🚪11🚀🥅", false),
        );
        expect(result.exitCode).toBe(10);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("executes functions", async () => {
        const result = await execute(
            compile(
                "🛒🔢multiply🛒🔢value1🔢value2 ⚽🪃value1✖️value2🚀🥅🚪multiply🔫3🌶️4🔫🚀",
                false,
            ),
        );
        expect(result.exitCode).toBe(12);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("executes for-statements", async () => {
        const result = await execute(
            compile(
                "☎️ 📦 i 🪢 0🚀 i ↘️ 5🚀 i ➕🪢 1🚀 ☎️ ⚽\n" +
                    "    🖨️ i🚀\n" +
                    "🥅",
                false,
            ),
        );
        expect(result.exitCode).toBe(0);
        expect(result.standardOut).toEqual([
            { text: "\u00000" },
            { text: "\u00001" },
            { text: "\u00002" },
            { text: "\u00003" },
            { text: "\u00004" },
        ]);
        expect(result.standardErr).toEqual([]);
    });
    it("executes while-statements", async () => {
        const result = await execute(
            compile(
                "📦i🪢0🚀\n" +
                    "🥏i↘️5🥏⚽\n" +
                    "    i➕🪢1🚀\n" +
                    "    🖨️i🚀\n" +
                    "🥅",
                false,
            ),
        );
        expect(result.exitCode).toBe(0);
        expect(result.standardOut).toEqual([
            { text: "\u00001" },
            { text: "\u00002" },
            { text: "\u00003" },
            { text: "\u00004" },
            { text: "\u00005" },
        ]);
        expect(result.standardErr).toEqual([]);
    });
    it("executes nested functions and if-statements", async () => {
        const result = await execute(
            compile(
                "📦a🪢2🚀📦b🪢3🚀🛒🔢multiply🛒🔢value1🔢value2 ⚽📦c🪢4🚀📦d🪢5🚀🛒🔢subtract🛒🔢value3🔢value4 ⚽📦e🪢6🚀📦f🪢7🚀✂️❌✂️⚽🪃1🚀🥅📐✅📐⚽🪃value4✖️e🚀🥅🗑️⚽🪃10🚀🥅🪃value4✖️e🚀🥅📦result🪢subtract🔫value1🌶️c🔫🚀🖨️result🚀🪃result✖️value2🚀🥅🖨️a🚀🚪multiply🔫b🌶️8🔫🚀",
                false,
            ),
        );
        expect(result.exitCode).toBe(192);
        expect(result.standardOut).toEqual([
            { text: "\u00002" },
            { text: "\u000024" },
        ]);
        expect(result.standardErr).toEqual([]);
    });
    it("test case 1", async () => {
        const result = await execute(
            compile(
                "📦a🪢2🚀\n" +
                    "📦b🪢3🚀 //       3        8\n" +
                    "🛒🔢multiply🛒🔢value1🔢value2 ⚽\n" +
                    "    📦c🪢4🚀\n" +
                    "    📦d🪢5🚀 //        3       4\n" +
                    "    🛒🔢subtract🛒🔢value3🔢value4 ⚽\n" +
                    "        📦e🪢6🚀\n" +
                    "        📦f🪢7🚀 //  3       4\n" +
                    "        🛒🔢ka🛒🔢value5🔢value6 ⚽\n" +
                    "\n" +
                    "                ✂️❌✂️⚽\n" +
                    "                    🪃1🚀\n" +
                    "                🥅📐✅📐⚽\n" +
                    "                    🪃value5✖️e🚀\n" +
                    "                🥅🗑️⚽\n" +
                    "                    🪃10🚀\n" +
                    "                🥅\n" +
                    "                //🪃value5✖️e🚀\n" +
                    "            🥅\n" +
                    "        \n" +
                    "        🪃ka🔫value3,value4🔫🚀\n" +
                    "    🥅\n" +
                    "    📦result🪢subtract🔫value1🌶️c🔫🚀\n" +
                    "    🖨️result🚀\n" +
                    "    🪃result✖️value2🚀\n" +
                    "🥅\n" +
                    "🖨️a🚀\n" +
                    "🚪multiply🔫b🌶️8🔫🚀",
                false,
            ),
        );
        expect(result.exitCode).toBe(144);
        expect(result.standardOut).toEqual([
            { text: "\u00002" },
            { text: "\u000018" },
        ]);
        expect(result.standardErr).toEqual([]);
    });
    it("test case 2", async () => {
        const result = await execute(
            compile(
                "let x = 10;\n" +
                    "if false if {\n" +
                    "    x = 11;\n" +
                    "} elseif true elseif {\n" +
                    "    let a = 3;\n" +
                    "    if a > 34 if {\n" +
                    "        x = 69;\n" +
                    "    }\n" +
                    "    else {\n" +
                    "    x = 12 * a;}\n" +
                    "} else {\n" +
                    "    x = 13;\n" +
                    "}\n" +
                    "\n" +
                    "exit x;",
                false,
            ),
        );
        expect(result.exitCode).toBe(36);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
});
