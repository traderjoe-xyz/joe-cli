import { getMasterchefV3 } from "./queries/masterchefV3.queries";
import { getMasterchefV2 } from "./queries/masterchefV2.queries";
import { getBoostedMasterchef } from "./queries/boostedmasterchef.queries";
import { getJoePrice } from "./queries/exchange.queries";
import { digestMasterchef } from "./digestMasterchef";

interface Result {
  pairname: string;
  pairaddress: string;
  allocation: string;
  joePerSec: string;
  farmTVL: string;
  APR: string;
}

export const getFarmsAllocations = async () => {
  const masterchefV2 = await getMasterchefV2();
  // Fetching all farms with >0 allocations from the subgraphs
  const masterchefV3 = await getMasterchefV3();
  const boostedmasterchef = await getBoostedMasterchef();

  const totaljoePerSec = masterchefV2.joePerSec;
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

  const V3farms = await digestMasterchef(
    masterchefV3,
    masterchefV2.totalAllocPoint,
    totaljoePerSec,
    joePrice
  );

  // Boosted farms APR is calculated the same way as V3 farms
  // So the APR displayed is Joe APR + Average boosted APR from veJoe
  const Boostedfarms = await digestMasterchef(
    boostedmasterchef,
    masterchefV2.totalAllocPoint,
    totaljoePerSec,
    joePrice
  );

  // Displaying results properly
  const results: Result[] = V2farms.concat(V3farms)
    .concat(Boostedfarms)
    .map((farm) => {
      return {
        pairname: farm.pairname,
        pairaddress: farm.pairaddress,
        farmTVL: farm.farmTVL.toFixed(0) + " $",
        allocation: farm.allocationweight.toFixed(2) + " %",
        joePerSec: farm.joePerSec.toFixed(3),
        APR: farm.APR.toFixed(2) + " %",
      };
    });

  console.table(results);
};
