import { assert, assertThrows } from "https://deno.land/std@0.74.0/testing/asserts.ts";

import {
  compose,
  map
} from "https://x.nest.land/ramda@0.27.0/source/index.js";

import Either from "https://deno.land/x/functional@v1.0.0/library/Either.js";
import Task from "https://deno.land/x/functional@v1.0.0/library/Task.js";

import { parseCodeDifference } from "./utilities.js";

const sampleA = `diff --git a/hoge b/piyo
index a13606c..1089adb 100755
--- a/hoge
+++ b/piyo
@@ -6,6 +6,7 @@ jobs:
+ // TODO: Should add explanation of the Y-combinator
+ const recurse = f => (x => x(x))(x => f(y => x(x)(y)));
+ const factorial = recurse(f => x => x == 0 ? 1 : x * f(x - 1));
+ factorial(42) === 1.4050061177528798e+51
`;

const sampleB = `diff --git a/hoge b/piyo
index a13606c..1089adb 100755
--- a/hoge
+++ b/piyo
@@ -6,6 +6,7 @@ jobs:
- // TODO: Should add explanation of the Y-combinator
+ // TODO: [FP-4242] Should add explanation of the Y-combinator
+ const recurse = f => (x => x(x))(x => f(y => x(x)(y)));
+ const factorial = recurse(f => x => x == 0 ? 1 : x * f(x - 1));
+ factorial(42) === 1.4050061177528798e+51
`;

Deno.test(
  "parseCodeDifference",
  () => assert(parseCodeDifference({ jiraTicketPrefix: "FP" })(sampleB))
);

Deno.test(
  "parseCodeDifference: Throws",
  () => assertThrows(
    () => parseCodeDifference({ jiraTicketPrefix: "FP" })(sampleA),
    Error,
    `Could not determine the Jira ticket number for new TODO: "Should add explanation of the Y-combinator".`
  )
);

Deno.test(
  "parseCodeDifference: With Task - Right",

  async () => {
    const container = await map(
      compose(
        parseCodeDifference({ jiraTicketPrefix: "FP" }),
        x => new TextDecoder().decode(x)
      )
    )
      (Task.wrap(_ => Promise.resolve(new TextEncoder().encode(sampleB)))).run();

    assert(Either.Right.is(container));
  }
);

Deno.test(
  "parseCodeDifference: With Task - Left",

  async () => {
    const container = await map(
      compose(
        parseCodeDifference({ jiraTicketPrefix: "FP" }),
        x => new TextDecoder().decode(x)
      )
    )
    (Task.wrap(_ => Promise.resolve(new TextEncoder().encode(sampleA)))).run();

    assert(Either.Left.is(container));
  }
);
