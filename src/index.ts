import { getMasterchefV3 } from "./queries/masterchefV3.queries";
import { getMasterchefV2 } from "./queries/masterchefV2.queries";
import { getPairs } from "./queries/core.queries";

interface Result {
  pairaddress: string;
  pairname: string;
  allocationweight?: number;
  joePerSec?: number;
}

const main = async () => {
  const masterchefsV2 = await getMasterchefV2();
  if (masterchefsV2.length === 0) {
    return;
  }
  const masterchefV2 = masterchefsV2[0];

  const masterchefsV3 = await getMasterchefV3();
  if (masterchefsV3.length === 0) {
    return;
  }
  const masterchefV3 = masterchefsV3[0];
  // console.log(masterchefV3.pools);

  const totaljoePerSec = masterchefV2.joePerSec;

  // console.log(masterchefV2);

  const MasterchefV3EmmisionShare =
    masterchefV2.pools.find((pool) => pool.id === "69").allocPoint / masterchefV2.totalAllocPoint;
  // console.log(MasterchefV3EmmisionShare);

  // console.log(QiEmmisionShare * totaljoePerSec);
  const masterchefsV3joePerSec = totaljoePerSec * MasterchefV3EmmisionShare;
  // console.log(masterchefsV3joePerSec / 1e18, totaljoePerSec / 1e18);

  const pairs = await getPairs(masterchefV3.pools.map((pool) => pool.pair));
  // console.log(pairs);

  let results: Result[] = pairs.map((pair) => {
    return { pairaddress: pair.id, pairname: pair.name };
  });
  results = results.map((result) => {
    let emmissionshare =
      masterchefV3.pools.find((pool) => pool.pair === result.pairaddress).allocPoint / masterchefV3.totalAllocPoint;
    return {
      pairaddress: result.pairaddress,
      pairname: result.pairname,
      allocationweight: emmissionshare * 100,
      joePerSec: (emmissionshare * masterchefsV3joePerSec) / 1e18,
    };
  });
  console.log(results.sort((a, b) => a.allocationweight - b.allocationweight));
  console.log(results.length);
};

main();
