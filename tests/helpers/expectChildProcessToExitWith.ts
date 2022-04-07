import { spawnTestChild } from "./spawnTestChild";

function exitPromise(child) {
  return new Promise((resolve) => {
    child.on("close", (exitCode) => {
      resolve(exitCode);
    });
  });
}

export async function expectChildProcessToExitWith(command, expectedExitCode) {
  const child = spawnTestChild(command);
  const exitCode = await exitPromise(child);

  expect(exitCode).toBe(expectedExitCode);
}
