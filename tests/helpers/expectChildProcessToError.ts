import { expectChildProcessToExitWith } from "./expectChildProcessToExitWith";

export async function expectChildProcessToError(command) {
  return expectChildProcessToExitWith(command, 1);
}
