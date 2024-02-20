import { Expression } from "./Expressions";
import { LiteralType } from "../types";
import { checkLiteralType, getEmojiFromLiteralType } from "../parser";
import { error } from "../tokenization";

export class BinaryExpression extends Expression {
    readonly lhsExpression: Expression;
    readonly rhsExpression: Expression;

    constructor(
        literalType: LiteralType,
        lhsExpression: Expression,
        rhsExpression: Expression,
        line: number,
    ) {
        super(literalType, line);
        this.lhsExpression = lhsExpression;
        this.rhsExpression = rhsExpression;
    }
}

export class BinaryExpressionAdd extends BinaryExpression {
    constructor(
        lhsExpression: Expression,
        rhsExpression: Expression,
        line: number,
    ) {
        checkLiteralType(
            lhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            lhsExpression.line,
        );
        checkLiteralType(
            rhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            rhsExpression.line,
        );
        super(
            lhsExpression.literalType === LiteralType.integerLiteral &&
                rhsExpression.literalType === LiteralType.integerLiteral
                ? LiteralType.integerLiteral
                : LiteralType.floatLiteral,
            lhsExpression,
            rhsExpression,
            line,
        );
    }
}
export class BinaryExpressionSub extends BinaryExpression {
    constructor(
        lhsExpression: Expression,
        rhsExpression: Expression,
        line: number,
    ) {
        checkLiteralType(
            lhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            lhsExpression.line,
        );
        checkLiteralType(
            rhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            rhsExpression.line,
        );
        super(
            lhsExpression.literalType === LiteralType.integerLiteral &&
                rhsExpression.literalType === LiteralType.integerLiteral
                ? LiteralType.integerLiteral
                : LiteralType.floatLiteral,
            lhsExpression,
            rhsExpression,
            line,
        );
    }
}
export class BinaryExpressionMul extends BinaryExpression {
    constructor(
        lhsExpression: Expression,
        rhsExpression: Expression,
        line: number,
    ) {
        checkLiteralType(
            lhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            lhsExpression.line,
        );
        checkLiteralType(
            rhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            rhsExpression.line,
        );
        super(
            lhsExpression.literalType === LiteralType.integerLiteral &&
                rhsExpression.literalType === LiteralType.integerLiteral
                ? LiteralType.integerLiteral
                : LiteralType.floatLiteral,
            lhsExpression,
            rhsExpression,
            line,
        );
    }
}
export class BinaryExpressionDiv extends BinaryExpression {
    constructor(
        lhsExpression: Expression,
        rhsExpression: Expression,
        line: number,
    ) {
        checkLiteralType(
            lhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            lhsExpression.line,
        );
        checkLiteralType(
            rhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            rhsExpression.line,
        );
        super(LiteralType.floatLiteral, lhsExpression, rhsExpression, line);
    }
}

export class BooleanBinaryExpressionCompare extends BinaryExpression {
    constructor(
        lhsExpression: Expression,
        rhsExpression: Expression,
        line: number,
    ) {
        if (lhsExpression.literalType !== rhsExpression.literalType) {
            error(
                "Expected equal types for comparison, but got '" +
                    getEmojiFromLiteralType(lhsExpression.literalType) +
                    "' and '" +
                    getEmojiFromLiteralType(rhsExpression.literalType) +
                    "'",
                lhsExpression.line,
            );
        }
        super(LiteralType.booleanLiteral, lhsExpression, rhsExpression, line);
    }
}
export class BooleanBinaryExpressionNotCompare extends BinaryExpression {
    constructor(
        lhsExpression: Expression,
        rhsExpression: Expression,
        line: number,
    ) {
        if (lhsExpression.literalType !== rhsExpression.literalType) {
            error(
                "Expected equal types for comparison, but got '" +
                    getEmojiFromLiteralType(lhsExpression.literalType) +
                    "' and '" +
                    getEmojiFromLiteralType(rhsExpression.literalType) +
                    "'",
                lhsExpression.line,
            );
        }
        super(LiteralType.booleanLiteral, lhsExpression, rhsExpression, line);
    }
}

export class BooleanBinaryExpressionGreaterEquals extends BinaryExpression {
    constructor(
        lhsExpression: Expression,
        rhsExpression: Expression,
        line: number,
    ) {
        checkLiteralType(
            lhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            lhsExpression.line,
        );
        checkLiteralType(
            rhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            rhsExpression.line,
        );
        super(LiteralType.booleanLiteral, lhsExpression, rhsExpression, line);
    }
}
export class BooleanBinaryExpressionLessThan extends BinaryExpression {
    constructor(
        lhsExpression: Expression,
        rhsExpression: Expression,
        line: number,
    ) {
        checkLiteralType(
            lhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            lhsExpression.line,
        );
        checkLiteralType(
            rhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            rhsExpression.line,
        );
        super(LiteralType.booleanLiteral, lhsExpression, rhsExpression, line);
    }
}
export class BooleanBinaryExpressionLessEquals extends BinaryExpression {
    constructor(
        lhsExpression: Expression,
        rhsExpression: Expression,
        line: number,
    ) {
        checkLiteralType(
            lhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            lhsExpression.line,
        );
        checkLiteralType(
            rhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            rhsExpression.line,
        );
        super(LiteralType.booleanLiteral, lhsExpression, rhsExpression, line);
    }
}
export class BooleanBinaryExpressionGreaterThan extends BinaryExpression {
    constructor(
        lhsExpression: Expression,
        rhsExpression: Expression,
        line: number,
    ) {
        checkLiteralType(
            lhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            lhsExpression.line,
        );
        checkLiteralType(
            rhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            rhsExpression.line,
        );
        super(LiteralType.booleanLiteral, lhsExpression, rhsExpression, line);
    }
}
export class BooleanBinaryExpressionAnd extends BinaryExpression {
    constructor(
        lhsExpression: Expression,
        rhsExpression: Expression,
        line: number,
    ) {
        checkLiteralType(
            lhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            lhsExpression.line,
        );
        checkLiteralType(
            rhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            rhsExpression.line,
        );
        super(LiteralType.booleanLiteral, lhsExpression, rhsExpression, line);
    }
}
export class BooleanBinaryExpressionOr extends BinaryExpression {
    constructor(
        lhsExpression: Expression,
        rhsExpression: Expression,
        line: number,
    ) {
        checkLiteralType(
            lhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            lhsExpression.line,
        );
        checkLiteralType(
            rhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            rhsExpression.line,
        );
        super(LiteralType.booleanLiteral, lhsExpression, rhsExpression, line);
    }
}
export class BooleanBinaryExpressionXor extends BinaryExpression {
    constructor(
        lhsExpression: Expression,
        rhsExpression: Expression,
        line: number,
    ) {
        checkLiteralType(
            lhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            lhsExpression.line,
        );
        checkLiteralType(
            rhsExpression.literalType,
            [LiteralType.floatLiteral, LiteralType.integerLiteral],
            rhsExpression.line,
        );
        super(LiteralType.booleanLiteral, lhsExpression, rhsExpression, line);
    }
}
