import { getMasterchefV3 } from "./queries/masterchefV3.queries";
import { getMasterchefV2 } from "./queries/masterchefV2.queries";
import { getBoostedMasterchef } from "./queries/boostedmasterchef.queries";
import { getJoePrice } from "./queries/exchange.queries";
import { digestMasterchef } from "./digestMasterchef";
import { FarmInfo } from "./digestMasterchef";
import chalk from "chalk";
import CliTable3 from "cli-table3";

interface Result {
  pairId: string;
  pairname: string;
  pairaddress: string;
  allocation: number;
  joePerSec: string;
  farmTVL: string;
  APR: string;
}

export const getFarmsAllocations = async () => {
  const masterchefV2 = await getMasterchefV2();
  // Fetching all farms with >0 allocations from the subgraphs
  const masterchefV3 = await getMasterchefV3();
  const boostedmasterchef = await getBoostedMasterchef();

  const totaljoePerSec = masterchefV2.joePerSec / 2;
  // Joe Price is taken from the USDC/Joe Pair
  const joePrice = await getJoePrice();

  // Non-pools contract like masterchefs V3/Boosted are automatically excluded
  // because they have no pool on the exchange
  const V2farms = await digestMasterchef(
    masterchefV2,
    masterchefV2.totalAllocPoint,
    totaljoePerSec,
    joePrice
  );

  displayResults(V2farms, "Masterchef V2");

  const V3farms = await digestMasterchef(
    masterchefV3,
    masterchefV2.totalAllocPoint,
    totaljoePerSec,
    joePrice
  );

  displayResults(V3farms, "Masterchef V3");

  // Boosted farms APR is calculated the same way as V3 farms
  // So the APR displayed is Joe APR + Average boosted APR from veJoe
  const Boostedfarms = await digestMasterchef(
    boostedmasterchef,
    masterchefV2.totalAllocPoint,
    totaljoePerSec,
    joePrice
  );

  displayResults(Boostedfarms, "Boosted farms");

  process.exit(0);
};

const displayResults = (farms: FarmInfo[], farmtype: string) => {
  let display: Result[] = farms.map((farm) => {
    return {
      pairId: farm.pairId,
      pairname: farm.pairname,
      pairaddress: farm.pairaddress,
      farmTVL: farm.farmTVL.toFixed(0) + " $",
      allocation: farm.allocationweight,
      joePerSec: farm.joePerSec.toFixed(3),
      APR: farm.APR.toFixed(2) + " %",
    };
  });

  const totalAllocPoint = farms
    .map((farm) => farm.allocationweight)
    .reduce((partialSum, a) => +partialSum + +a, 0);

  let table = new CliTable3({
    head: [
      "Farm Index",
      "Pair Name",
      "Pair Address",
      "Farm TVL",
      "Allocation points",
      "Joe/s",
      "APR",
    ],
  });

  display = display.sort((a, b) => parseInt(a.pairId) - parseInt(b.pairId));
  console.log();
  console.log(chalk.red(farmtype + " :"));
  display.forEach((result) => table.push(Object.values(result)));
  console.log(table.toString());
  console.log(chalk.blue("Total allocation : " + totalAllocPoint));
};
