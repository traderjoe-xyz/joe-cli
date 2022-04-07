import { expectChildProcessToExitWith } from "./expectChildProcessToExitWith";

export async function expectChildProcessToSucceed(command) {
  return expectChildProcessToExitWith(command, 0);
}
