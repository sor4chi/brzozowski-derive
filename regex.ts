export type _Symbol = string;

export interface _Regexp {
  nullable: boolean;
  derive: (symbol: _Symbol) => _Regexp;
}

export class Empty implements _Regexp {
  nullable = false;
  derive(): _Regexp {
    // D(∅) = ∅
    return new Empty();
  }
}

export class Epsilon implements _Regexp {
  nullable = true;
  derive(): _Regexp {
    // D(ε) = ∅
    return new Empty();
  }
}

export class SymbolRegExp implements _Regexp {
  nullable = false;
  // a
  constructor(private a: _Symbol) {}
  derive(b: _Symbol): _Regexp {
    // D_b(a) = {
    //   ε [if a = b]
    //   ∅ [otherwise]
    // }
    return b === this.a ? new Epsilon() : new Empty();
  }
}

export class Concatenation implements _Regexp {
  // ab
  constructor(private a: _Regexp, private b: _Regexp) {}
  get nullable(): boolean {
    return this.a.nullable && this.b.nullable;
  }
  derive(c: _Symbol): _Regexp {
    // D_c(ab) = {
    //   D_c(a)b | D_c(b) [if ε ∈ L(a)]
    //   D_c(a)b [otherwise]
    // }
    if (this.a.nullable) {
      // D_c(a)b | D_c(b)
      return new Alternation(
        new Concatenation(this.a.derive(c), this.b),
        this.b.derive(c)
      );
    }
    // D_c(a)b
    return new Concatenation(this.a.derive(c), this.b);
  }
}

export class Alternation implements _Regexp {
  // a|b
  constructor(private a: _Regexp, private b: _Regexp) {}
  get nullable(): boolean {
    return this.a.nullable || this.b.nullable;
  }
  derive(c: _Symbol): _Regexp {
    // D_c(a|b) = D_c(a) | D_c(b)
    return new Alternation(this.a.derive(c), this.b.derive(c));
  }
}

export class KleeneStar implements _Regexp {
  nullable = true;
  // a*
  constructor(private a: _Regexp) {}
  derive(c: _Symbol): _Regexp {
    // D_c(a*) = D_c(a)a*
    return new Concatenation(this.a.derive(c), new KleeneStar(this.a));
  }
}

export function brzozowskiDerive(regExp: _Regexp, input: _Symbol[]): _Regexp {
  let result = regExp;
  for (const symbol of input) {
    result = result.derive(symbol);
  }
  return result;
}
