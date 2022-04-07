import { getMasterchefV3 } from "./queries/masterchefV3.queries";
import { getMasterchefV2 } from "./queries/masterchefV2.queries";
import { getBoostedMasterchef } from "./queries/boostedmasterchef.queries";
import { getJoePrice } from "./queries/exchange.queries";
import { digestMasterchef } from "./digestMasterchef";

interface Result {
  pairname: string;
  pairaddress: string;
  allocation?: string;
  joePerSec?: string;
  poolTotalSupply?: number;
  farmTVL: string;
  APR?: string;
}

const main = async () => {
  const masterchefV2 = await getMasterchefV2();
  const masterchefV3 = await getMasterchefV3();
  const boostedmasterchef = await getBoostedMasterchef();

  const totaljoePerSec = masterchefV2.joePerSec;
  const joePrice = await getJoePrice();

  const V3farms = await digestMasterchef(
    masterchefV3,
    masterchefV2.totalAllocPoint,
    totaljoePerSec,
    joePrice
  );
  const Boostedfarms = await digestMasterchef(
    boostedmasterchef,
    masterchefV2.totalAllocPoint,
    totaljoePerSec,
    joePrice
  );

  const results: Result[] = V3farms.concat(Boostedfarms).map((farm) => {
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

main();
