import {
  both,
  complement,
  compose,
  curry,
  filter,
  lift,
  map,
  match,
  prop,
  reduce,
  split,
  test,
  trim,
  useWith,
  when
} from "https://x.nest.land/ramda@0.27.0/source/index.js";

import Either from "https://deno.land/x/functional@v1.0.0/library/Either.js";
import Task from "https://deno.land/x/functional@v1.0.0/library/Task.js";

const parseCodeDifference = options => map(
  compose(
    map(
      compose(
        when(
          both(
            test(/^\+\s*\/\/\s*TODO\:\s*(.+)/),
            complement(test(new RegExp(`${options.jiraTicketPrefix}-[0-9]+`)))
          ),
          text => {
            throw new Error(`Could not determine the Jira ticket number for new TODO: "${text}".`)
          }
        )
      )
    ),
    split(/\n/),
    x => new TextDecoder().decode(x)
  )
);

const container = await parseCodeDifference({ jiraTicketPrefix: Deno.env.get("JIRA_TICKET_PREFIX") })
  (Task.wrap(_ => Deno.readAll(Deno.stdin))).run();

// TODO: VE-6969 Find a better way to inspect Either.Left's value.
if (Either.Left.is(container)) {
  console.error(container[Symbol.for("Value")]);
  Deno.exit(1);
}