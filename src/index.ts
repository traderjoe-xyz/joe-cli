import { getMasterchefV3 } from "./queries/masterchefV3.queries";
import { getMasterchefV2 } from "./queries/masterchefV2.queries";
import { getJoePrice, getPairs } from "./queries/core.queries";
import { ethers, utils } from "ethers";
import FARMLENS from "./FarmLensV2.json";
import { FarmLensV2 } from "generated";
import { getBoostedMasterchef } from "./queries/boostedmasterchef.queries";

interface Result {
  pairaddress?: string;
  pairname: string;
  allocationweight?: string;
  joePerSec?: string;
  poolTotalSupply?: number;
  TVL: number;
  APR?: string;
}

const main = async () => {
  // const provider = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc");
  // const FarmLens = new ethers.Contract(FARMLENS.address, FARMLENS.abi, provider) as FarmLensV2;

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

  const boostedmasterchefs = await getBoostedMasterchef();
  if (boostedmasterchefs.length === 0) {
    return;
  }
  const boostedmasterchef = boostedmasterchefs[0];

  const totaljoePerSec = masterchefV2.joePerSec;
  const joePrice = await getJoePrice();

  const V3pairs = await getPairs(masterchefV3.pools.map((pool) => pool.pair));

  let V3results: Result[] = V3pairs.map((pair) => {
    return { pairaddress: pair.id, pairname: pair.name, TVL: pair.reserveUSD, poolTotalSupply: pair.totalSupply };
  });
  V3results = V3results.map((result) => {
    const correspondingPool = masterchefV3.pools.find((pool) => pool.pair === result.pairaddress);
    const emmissionshare = correspondingPool.allocPoint / masterchefV2.totalAllocPoint;
    const joePerSec = (emmissionshare * totaljoePerSec) / 1e18;
    const tvl = (correspondingPool.jlpBalance / result.poolTotalSupply) * result.TVL;
    return {
      pairaddress: result.pairaddress,
      pairname: result.pairname,
      TVL: tvl,
      allocationweight: (emmissionshare * 100).toFixed(2),
      joePerSec: joePerSec.toFixed(2),
      APR: ((joePrice * joePerSec * 60 * 60 * 24 * 365 * 100) / 2 / tvl).toFixed(2),
    };
  });

  const Boostedpairs = await getPairs(boostedmasterchef.pools.map((pool) => pool.pair));

  let Boostedresults: Result[] = Boostedpairs.map((pair) => {
    return { pairaddress: pair.id, pairname: pair.name, TVL: pair.reserveUSD, poolTotalSupply: pair.totalSupply };
  });
  Boostedresults = Boostedresults.map((result) => {
    const correspondingPool = boostedmasterchef.pools.find((pool) => pool.pair === result.pairaddress);

    const emmissionshare = correspondingPool.allocPoint / masterchefV2.totalAllocPoint;
    const joePerSec = (emmissionshare * totaljoePerSec) / 1e18;
    const tvl = (correspondingPool.jlpBalance / result.poolTotalSupply) * result.TVL;
    return {
      pairaddress: result.pairaddress,
      pairname: result.pairname,
      TVL: tvl,
      allocationweight: (emmissionshare * 100).toFixed(2),
      joePerSec: joePerSec.toFixed(2),
      APR: ((1.28 * joePerSec * 60 * 60 * 24 * 365 * 100) / 2 / tvl).toFixed(2),
    };
  });

  console.log(Boostedresults);
};

main();
