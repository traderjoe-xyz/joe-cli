import { FARMSALLOCATION } from "./farms/index";
import { composeCommand } from "./composeCommand";

/**
 * The order here is the order commands will appear in help outputs. Commands
 * are grouped and then sorted by authentication and action type.
 */
export const COMMANDS = [FARMSALLOCATION];

export { composeCommand };
