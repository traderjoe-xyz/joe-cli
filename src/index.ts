import { getMasterchefV3 } from "./queries/masterchefV3.queries";
import { getMasterchefV2 } from "./queries/masterchefV2.queries";
import { getBoostedMasterchef } from "./queries/boostedmasterchef.queries";
import { getJoePrice } from "./queries/exchange.queries";
import { digestMasterchef } from "./digestMasterchef";

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

  console.log(masterchefV2);
};

main();
