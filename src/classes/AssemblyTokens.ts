export class AssemblyToken {
    comment: string;

    constructor(comment: string) {
        this.comment = comment;
    }

    clearComment() {
        this.comment = "";
        return this;
    }
}

export class AssemblyPushToken extends AssemblyToken {
    readonly expression: string;
    constructor(expression: string, comment: string = "") {
        super(comment);
        this.expression = expression;
    }
}
export class AssemblyPopToken extends AssemblyToken {
    readonly register: string;
    constructor(register: string, comment: string = "") {
        super(comment);
        this.register = register;
    }
}
export class AssemblyMovToken extends AssemblyToken {
    readonly expression: string;
    readonly register: string;
    constructor(register: string, expression: string, comment: string = "") {
        super(comment);
        this.expression = expression;
        this.register = register;
    }
}
export class AssemblyUnoptimizedToken extends AssemblyToken {
    readonly string: string;
    constructor(string: string, comment: string = "") {
        super(comment);
        this.string = string;
    }
}
export class AssemblyAddToken extends AssemblyToken {
    readonly expression: string;
    readonly register: string;
    constructor(register: string, expression: string, comment: string = "") {
        super(comment);
        this.expression = expression;
        this.register = register;
    }
}
export class AssemblySubToken extends AssemblyToken {
    readonly expression: string;
    readonly register: string;
    constructor(register: string, expression: string, comment: string = "") {
        super(comment);
        this.expression = expression;
        this.register = register;
    }
}
export class AssemblyMulToken extends AssemblyToken {
    readonly expression: string;
    constructor(expression: string, comment: string = "") {
        super(comment);
        this.expression = expression;
    }
}
export class AssemblyDivToken extends AssemblyToken {
    readonly expression: string;
    constructor(expression: string, comment: string = "") {
        super(comment);
        this.expression = expression;
    }
}

export class AssemblyCommentToken extends AssemblyToken {
    constructor(comment: string) {
        super(comment);
    }
}
