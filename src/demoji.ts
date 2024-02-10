/** Turn all the emojis in the source into standard expressions that the tokenizer can understand
 * */
export function demoji(source: string) {
    return source
        .replaceAll("🚪", "exit ")
        .replaceAll("🚀", ";")
        .replaceAll("📦", "let ")
        .replaceAll("🪢", "=")
        .replaceAll("🚧", "(")
        .replaceAll("🧱", ")")
        .replaceAll("➖", "-")
        .replaceAll("✖️", "*")
        .replaceAll("➕", "+")
        .replaceAll("➗", "/")
        .replaceAll("✂️", " if ")
        .replaceAll("⚽", "{")
        .replaceAll("🥅", "}")
        .replaceAll("📣", "//")
        .replaceAll("📯", "/$")
        .replaceAll("📐", " elseif ")
        .replaceAll("🗑️", " else ")
        .replaceAll("✅", "1")
        .replaceAll("❌🔗", "!=")
        .replaceAll("❌", "0")
        .replaceAll("🔗", "==");
}
