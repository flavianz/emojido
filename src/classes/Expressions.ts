import { LineCount, LiteralType } from "../types";

export class Expression {
    readonly literalType: LiteralType;
    readonly line: LineCount;

    constructor(literalType: LiteralType, line: LineCount) {
        this.literalType = literalType;
        this.line = line;
    }
}
