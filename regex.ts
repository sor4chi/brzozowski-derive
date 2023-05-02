export type _Symbol = string;

export interface _Regexp {
  nullable: boolean;
  derive: (symbol: _Symbol) => _Regexp;
}

export class Empty implements _Regexp {
  nullable = false;
  derive(): _Regexp {
    return new Empty();
  }
}

export class Epsilon implements _Regexp {
  nullable = true;
  derive(): _Regexp {
    return new Empty();
  }
}

export class SymbolRegExp implements _Regexp {
  nullable = false;
  constructor(private symbol: _Symbol) {}
  derive(symbol: _Symbol): _Regexp {
    return symbol === this.symbol ? new Epsilon() : new Empty();
  }
}

export class Concatenation implements _Regexp {
  constructor(private left: _Regexp, private right: _Regexp) {}
  get nullable(): boolean {
    return this.left.nullable && this.right.nullable;
  }
  derive(symbol: _Symbol): _Regexp {
    if (this.left.nullable) {
      return new Alternation(
        new Concatenation(this.left.derive(symbol), this.right),
        this.right.derive(symbol)
      );
    } else {
      // (a|b)b
      return new Concatenation(this.left.derive(symbol), this.right);
    }
  }
}

export class Alternation implements _Regexp {
  constructor(private left: _Regexp, private right: _Regexp) {}
  get nullable(): boolean {
    return this.left.nullable || this.right.nullable;
  }
  derive(symbol: _Symbol): _Regexp {
    return new Alternation(this.left.derive(symbol), this.right.derive(symbol));
  }
}

export class KleeneStar implements _Regexp {
  nullable = true;
  constructor(private expression: _Regexp) {}
  derive(symbol: _Symbol): _Regexp {
    return new Concatenation(
      this.expression.derive(symbol),
      new KleeneStar(this.expression)
    );
  }
}

export function brzozowskiDerive(regExp: _Regexp, input: _Symbol[]): _Regexp {
  let result = regExp;
  for (const symbol of input) {
    result = result.derive(symbol);
  }
  return result;
}
