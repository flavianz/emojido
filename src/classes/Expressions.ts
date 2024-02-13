import { LiteralType } from "../types";

export class Expression {
    readonly literalType: LiteralType;
    readonly line: number;

    constructor(literalType: LiteralType, line: number) {
        this.literalType = literalType;
        this.line = line;
    }
}
