import { Command } from "commander";

import { runCommand } from "../runCommand";

export function composeCommand(config) {
  // Name, description, and action are required.
  const command = new Command(config.name)
    .description(config.description)
    .helpOption("-h, --help", "Display help for command.")
    .action(async (inlineCommandOptions) => {
      await runCommand(config, inlineCommandOptions);
    });

  return command;
}
