import { assertEquals } from "https://deno.land/std@0.158.0/testing/asserts.ts";
import {
  Alternation,
  brzozowskiDerive,
  Concatenation,
  Epsilon,
  Empty,
  KleeneStar,
  SymbolRegExp,
} from "./regex.ts";

Deno.test("brzozowskiDerive - empty - should reject empty input", () => {
  const regExp = new Empty();
  const input: string[] = [];
  const result = brzozowskiDerive(regExp, input);
  assertEquals(result.nullable, false);
});

Deno.test("brzozowskiDerive - empty - should reject non-empty input", () => {
  const regExp = new Empty();
  const input: string[] = ["a", "b", "c"];
  const result = brzozowskiDerive(regExp, input);
  assertEquals(result.nullable, false);
});

Deno.test("brzozowskiDerive - epsilon - should accept empty input", () => {
  const regExp = new Epsilon();
  const input: string[] = [];
  const result = brzozowskiDerive(regExp, input);
  assertEquals(result.nullable, true);
});

Deno.test("brzozowskiDerive - epsilon - should reject non-empty input", () => {
  const regExp = new Epsilon();
  const input: string[] = ["a", "b", "c"];
  const result = brzozowskiDerive(regExp, input);
  assertEquals(result.nullable, false);
});

Deno.test("brzozowskiDerive - symbol - should accept matching input", () => {
  const regExp = new SymbolRegExp("a");
  const input: string[] = ["a"];
  const result = brzozowskiDerive(regExp, input);
  assertEquals(result.nullable, true);
});

Deno.test(
  "brzozowskiDerive - symbol - should reject non-matching input",
  () => {
    const regExp = new SymbolRegExp("a");
    const input: string[] = ["b"];
    const result = brzozowskiDerive(regExp, input);
    assertEquals(result.nullable, false);
  }
);

Deno.test(
  "brzozowskiDerive - concatenation - should accept matching input",
  () => {
    const regExp = new Concatenation(
      new SymbolRegExp("a"),
      new SymbolRegExp("b")
    );
    const input: string[] = ["a", "b"];
    const result = brzozowskiDerive(regExp, input);
    assertEquals(result.nullable, true);
  }
);

Deno.test(
  "brzozowskiDerive - concatenation - should reject non-matching input",
  () => {
    const regExp = new Concatenation(
      new SymbolRegExp("a"),
      new SymbolRegExp("b")
    );
    const input: string[] = ["a", "a"];
    const result = brzozowskiDerive(regExp, input);
    assertEquals(result.nullable, false);
  }
);

Deno.test(
  "brzozowskiDerive - concatenation - should accept matching input with epsilon",
  () => {
    const regExp = new Concatenation(new SymbolRegExp("a"), new Epsilon());
    const input: string[] = ["a"];
    const result = brzozowskiDerive(regExp, input);
    assertEquals(result.nullable, true);
  }
);

Deno.test(
  "brzozowskiDerive - concatenation - should reject non-matching input with epsilon",
  () => {
    const regExp = new Concatenation(new SymbolRegExp("a"), new Epsilon());
    const input: string[] = ["b"];
    const result = brzozowskiDerive(regExp, input);
    assertEquals(result.nullable, false);
  }
);

Deno.test(
  "brzozowskiDerive - alternation - should accept matching input",
  () => {
    const regExp = new Alternation(
      new SymbolRegExp("a"),
      new SymbolRegExp("b")
    );
    const input: string[] = ["a"];
    const result = brzozowskiDerive(regExp, input);
    assertEquals(result.nullable, true);
  }
);

Deno.test(
  "brzozowskiDerive - alternation - should reject non-matching input",
  () => {
    const regExp = new Alternation(
      new SymbolRegExp("a"),
      new SymbolRegExp("b")
    );
    const input: string[] = ["c"];
    const result = brzozowskiDerive(regExp, input);
    assertEquals(result.nullable, false);
  }
);

Deno.test(
  "brzozowskiDerive - alternation - should accept matching input with epsilon",
  () => {
    const regExp = new Alternation(new SymbolRegExp("a"), new Epsilon());
    const input: string[] = ["a"];
    const result = brzozowskiDerive(regExp, input);
    assertEquals(result.nullable, true);
  }
);

Deno.test(
  "brzozowskiDerive - alternation - should reject non-matching input with epsilon",
  () => {
    const regExp = new Alternation(new SymbolRegExp("a"), new Epsilon());
    const input: string[] = ["b"];
    const result = brzozowskiDerive(regExp, input);
    assertEquals(result.nullable, false);
  }
);

Deno.test("brzozowskiDerive - kleene star - should accept empty input", () => {
  const regExp = new KleeneStar(new SymbolRegExp("a"));
  const input: string[] = [];
  const result = brzozowskiDerive(regExp, input);
  assertEquals(result.nullable, true);
});

Deno.test(
  "brzozowskiDerive - kleene star - should accept matching input",
  () => {
    const regExp = new KleeneStar(new SymbolRegExp("a"));
    const input: string[] = ["a"];
    const result = brzozowskiDerive(regExp, input);
    assertEquals(result.nullable, true);
  }
);

Deno.test(
  "brzozowskiDerive - kleene star - should reject non-matching input",
  () => {
    const regExp = new KleeneStar(new SymbolRegExp("a"));
    const input: string[] = ["b"];
    const result = brzozowskiDerive(regExp, input);
    assertEquals(result.nullable, false);
  }
);

Deno.test(
  "brzozowskiDerive - kleene star - should accept matching input with epsilon",
  () => {
    const regExp = new KleeneStar(new SymbolRegExp("a"));
    const input: string[] = Array(10).fill("a");
    const result = brzozowskiDerive(regExp, input);
    assertEquals(result.nullable, true);
  }
);

Deno.test(
  "brzozowskiDerive - kleene star - should reject or-nested kleene star",
  () => {
    const regExp = new KleeneStar(
      new Alternation(new SymbolRegExp("a"), new SymbolRegExp("b"))
    );
    const input: string[] = ["a", "b", "a", "b"];
    const result = brzozowskiDerive(regExp, input);
    assertEquals(result.nullable, true);
  }
);
