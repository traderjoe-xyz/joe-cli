#!/usr/bin/env node

import { program } from "commander";

import { COMMANDS, composeCommand } from "./commands/index";

function addCommands() {
  for (const config of COMMANDS) {
    const command = composeCommand(config);

    program.addCommand(command);
  }
}

function start() {
  program.usage("[command] [options]");

  program.version("0.0.2", "-v, --version", "Output the version number.");

  program.addHelpCommand("help [command]", "Display help for command.");
  program.helpOption("-h, --help", "Display help for command.");

  program.addHelpText("after", "\nGitHub: https://github.com/traderjoe-xyz/joe-cli#readme");

  addCommands();

  program.parse(process.argv);
}

start();
