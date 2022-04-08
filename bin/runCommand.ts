async function runHandler(run) {
  await run();
}

export async function runCommand(commandConfig, inlineCommandOptions) {
  try {
    await runHandler(commandConfig.run);
  } catch (error) {
    console.log(error);
  }
}
