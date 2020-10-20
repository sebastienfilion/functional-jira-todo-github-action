import {
  compose,
  map
} from "https://x.nest.land/ramda@0.27.0/source/index.js";

import Either from "https://deno.land/x/functional@v1.0.0/library/Either.js";
import Task from "https://deno.land/x/functional@v1.0.0/library/Task.js";

import { parseCodeDifference } from "./utilities.js";

const decode = new TextEncoder().decode;

const container = await map(
  compose(
    parseCodeDifference({ jiraTicketPrefix: "FP" }),
    x => new TextDecoder().decode(x)
  )
)
  (Task.wrap(_ => Deno.readAll(Deno.stdin))).run();

if (Either.Left.is(container)) {
  console.error(container[Symbol.for("Value")]);
  Deno.exit(1);
}
