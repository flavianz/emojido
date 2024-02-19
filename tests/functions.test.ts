import { compile } from "../src/compiler";
import { execute } from "../src/assemble";

describe("Compiler", () => {
    it("exits", async () => {
        const result = await execute(compile("🚪21🚀"));
        expect(result.exitCode).toBe(21);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("prints strings", async () => {
        const result = await execute(compile("🖨️🔠Hello, World!🔠🚀"));
        expect(result.exitCode).toBe(0);
        expect(result.standardOut).toEqual([{ text: "Hello, World!" }]);
        expect(result.standardErr).toEqual([]);
    });
    it("prints integers", async () => {
        const result = await execute(compile("🖨️69🚀"));
        expect(result.exitCode).toBe(0);
        expect(result.standardOut).toEqual([{ text: "\u000069" }]);
        expect(result.standardErr).toEqual([]);
    });
    it("prints integers", async () => {
        const result = await execute(compile("🖨️69🚀"));
        expect(result.exitCode).toBe(0);
        expect(result.standardOut).toEqual([{ text: "\u000069" }]);
        expect(result.standardErr).toEqual([]);
    });
    it("defines variables", async () => {
        const result = await execute(compile("📦x🪢17🚀🚪x🚀"));
        expect(result.exitCode).toBe(17);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("reassigns variables", async () => {
        const result = await execute(compile("📦x🪢17🚀x🪢69🚀🚪x🚀"));
        expect(result.exitCode).toBe(69);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("adds", async () => {
        const result = await execute(compile("🚪5➕3🚀"));
        expect(result.exitCode).toBe(8);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("subtracts", async () => {
        const result = await execute(compile("🚪5➖3🚀"));
        expect(result.exitCode).toBe(2);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("multiplies", async () => {
        const result = await execute(compile("🚪5✖️3🚀"));
        expect(result.exitCode).toBe(15);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("divides", async () => {
        const result = await execute(compile("📦x🪢5➗2🚀🚪0🚀"));
        expect(result.exitCode).toBe(0);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("executes if-statements", async () => {
        const result = await execute(compile("✂️✅✂️⚽🚪10🚀🥅"));
        expect(result.exitCode).toBe(10);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("executes else-statements", async () => {
        const result = await execute(compile("✂️❌✂️⚽🚪10🚀🥅🗑️⚽🚪11🚀🥅"));
        expect(result.exitCode).toBe(11);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("executes elseif-statements", async () => {
        const result = await execute(
            compile("✂️❌✂️⚽🚪9🚀🥅📐✅📐⚽🚪10🚀🥅🗑️⚽🚪11🚀🥅"),
        );
        expect(result.exitCode).toBe(10);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("compares", async () => {
        const result = await execute(
            compile("✂️❌✂️⚽🚪9🚀🥅📐✅📐⚽🚪10🚀🥅🗑️⚽🚪11🚀🥅"),
        );
        expect(result.exitCode).toBe(10);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("executes functions", async () => {
        const result = await execute(
            compile(
                "🛒🔢multiply🛒🔢value1🔢value2 ⚽🪃value1✖️value2🚀🥅🚪multiply🔫3🌶️4🔫🚀",
            ),
        );
        expect(result.exitCode).toBe(12);
        expect(result.standardOut).toEqual([]);
        expect(result.standardErr).toEqual([]);
    });
    it("executes nested functions and if-statements", async () => {
        const result = await execute(
            compile(
                "📦a🪢2🚀📦b🪢3🚀🛒🔢multiply🛒🔢value1🔢value2 ⚽📦c🪢4🚀📦d🪢5🚀🛒🔢subtract🛒🔢value3🔢value4 ⚽📦e🪢6🚀📦f🪢7🚀✂️❌✂️⚽🪃1🚀🥅📐✅📐⚽🪃value4✖️e🚀🥅🗑️⚽🪃10🚀🥅🪃value4✖️e🚀🥅📦result🪢subtract🔫value1🌶️c🔫🚀🖨️result🚀🪃result✖️value2🚀🥅🖨️a🚀🚪multiply🔫b🌶️8🔫🚀",
            ),
        );
        expect(result.exitCode).toBe(192);
        expect(result.standardOut).toEqual([
            { text: "\u00002" },
            { text: "\u000024" },
        ]);
        expect(result.standardErr).toEqual([]);
    });
});
