/** Turn all the emojis in the source into standard expressions that the tokenizer can understand
 * */
export function demoji(source: string) {
    return source
        .replaceAll("🚪", "exit ")
        .replaceAll("🚀", ";")
        .replaceAll("📦", "let ")

        .replaceAll("🚧", "(")
        .replaceAll("🧱", ")")
        .replaceAll("➖🪢", " minusequal ")
        .replaceAll("✖️🪢", " *= ")
        .replaceAll("➕🪢", " += ")
        .replaceAll("➗🪢", " /= ")
        .replaceAll("🪢", "=")
        .replaceAll("➖", " minus ")
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
        .replaceAll("✅", "true")
        .replaceAll("❌🔗", "!=")
        .replaceAll("🎗️", "!|")
        .replaceAll("❌", "false")
        .replaceAll("↘️🔗", "<=")
        .replaceAll("↗️🔗", ">=")
        .replaceAll("🔗", "==")
        .replaceAll("🪇", "&&")
        .replaceAll("🪜", "||")
        .replaceAll("🖨️", "print ")
        .replaceAll("🔠", '"')
        .replaceAll("↘️", "<")
        .replaceAll("↗️", ">")
        .replaceAll("🔢", " int ")
        .replaceAll("🧮", " float ")
        .replaceAll("🛒", " function ")
        .replaceAll("⚜️", " bool ")
        .replaceAll("📜", " string ")
        .replaceAll("🌶️", ",")
        .replaceAll("🔫", " call ")
        .replaceAll("🪃", "return ")
        .replaceAll("🫥", " null ")
        .replaceAll("🥏", " while ")
        .replaceAll("☎️", " for ")
        .replaceAll("🌜", "[")
        .replaceAll("🌛", "]");
}
