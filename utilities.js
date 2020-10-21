import {
  both,
  complement,
  compose,
  map,
  split,
  test,
  when
} from "https://x.nest.land/ramda@0.27.0/source/index.js";

const $$todo = /^\+\s*\/\/\s*TODO\:\s*(.+)/;

export const parseCodeDifference = options => compose(
  _ => true,
  map(
    compose(
      when(
        both(
          test($$todo),
          complement(test(new RegExp(`${options.jiraTicketPrefix}-[0-9]+`)))
        ),
        text => {
          throw new Error(`Could not determine the Jira ticket number for new TODO: "${text.match($$todo)[1]}".`)
        }
      )
    )
  ),
  split(/\n/)
);