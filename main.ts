import {
  Alternation,
  brzozowskiDerive,
  Concatenation,
  KleeneStar,
  SymbolRegExp,
  _Regexp,
  _Symbol,
} from "./regex.ts";

export function brzozowskiMatch(regExp: _Regexp, input: _Symbol[]): boolean {
  let currentRegExp = regExp;
  currentRegExp = brzozowskiDerive(currentRegExp, input);
  return currentRegExp.nullable;
}

function main() {
  // (a|b)*c
  const regExp = new Concatenation(
    new KleeneStar(
      new Alternation(new SymbolRegExp("a"), new SymbolRegExp("b"))
    ),
    new SymbolRegExp("c")
  );
  const input = ["a", "b", "a", "b", "c"];
  const result = brzozowskiMatch(regExp, input);
  console.log(result);
}

main();
