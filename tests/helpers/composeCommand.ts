export function composeCommand(command, options) {
  return `node ./dist/index.js ${command}${options}`;
}
