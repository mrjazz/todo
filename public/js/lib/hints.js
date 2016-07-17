const dateHints = [
  'today', 'tomorrow', 'July 2008', 'next friday',
  'last April', '2004.08.07', '6/4/2005', '8:15 PM',
  '22:30:45', '+5years', 't + 5 d (today + 5 days)',
  't (today)', 'n (now)', '+2h (in 2 hours)'
];

const commandHints = [
  'collapseAll (collapse all nodes)',
  'addTodo buy a milk'
];

function randomHint(hints) {
  return hints[Math.floor(Math.random() * hints.length)]
}

export function getDateHint() {
  return `You can use something like '${randomHint(dateHints)}'`;
}

export function getCommandHint() {
  return `You can use something like '${randomHint(commandHints)}'`;
}
