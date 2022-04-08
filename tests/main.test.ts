import { expectChildProcessToSucceedI } from "./helpers/index";

describe("[COMMAND] Main", () => {
  test("SUCCEEDS: Main farm list", async () => {
    await expectChildProcessToSucceedI(`node ./dist/bin/cli.js farm-allocations`);
  });
});
