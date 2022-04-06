import { getMasterchefV3 } from "./queries/masterchefV3.queries";
import { getMasterchefV2 } from "./queries/masterchefV2.queries";
import { getPairs } from "./queries/core.queries";
import { ethers, utils } from "ethers";
import FARMLENS from "./FarmLensV2.json";
import { FarmLensV2 } from "generated";

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
  const provider = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc");
  const FarmLens = new ethers.Contract(FARMLENS.address, FARMLENS.abi, provider) as FarmLensV2;

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

  // console.log(
  //   masterchefV3.pools.map((pool) => {
  //     return parseInt(pool.id);
  //   })
  // );

  let farms = await FarmLens.getMCFarmInfos(
    masterchefV3.id,
    // masterchefV2.pools.map((pool) => {
    //   return parseInt(pool.id) - 1;
    // })
    [19]
  );
  // console.log(
  //   farms[0].token0Symbol,
  //   farms[0].token1Symbol,
  //   utils.formatEther(farms[0].reserveUsd.mul(farms[0].chefBalanceScaled).div(farms[0].totalSupplyScaled))
  // );

  // process.exit(1);

  const totaljoePerSec = masterchefV2.joePerSec;

  console.log(masterchefV2);

  const MasterchefV3EmmisionShare =
    masterchefV2.pools.find((pool) => pool.id === "66").allocPoint / masterchefV2.totalAllocPoint;
  // console.log(MasterchefV3EmmisionShare);

  // console.log(QiEmmisionShare * totaljoePerSec);
  const masterchefsV3joePerSec = totaljoePerSec * MasterchefV3EmmisionShare;
  // console.log(masterchefsV3joePerSec / 1e18, totaljoePerSec / 1e18);

  const pairs = await getPairs(masterchefV3.pools.map((pool) => pool.pair));
  // console.log(pairs);

  let results: Result[] = pairs.map((pair) => {
    return { pairaddress: pair.id, pairname: pair.name, TVL: pair.reserveUSD, poolTotalSupply: pair.totalSupply };
  });
  results = results.map((result) => {
    // let emmissionshare =
    //   masterchefV3.pools.find((pool) => pool.pair === result.pairaddress).allocPoint / masterchefV3.totalAllocPoint;
    const correspondingPool = masterchefV3.pools.find((pool) => pool.pair === result.pairaddress);
    const emmissionshare = correspondingPool.allocPoint / masterchefV3.totalAllocPoint;
    const joePerSec = (emmissionshare * masterchefsV3joePerSec) / 1e18;
    const tvl = (correspondingPool.jlpBalance / result.poolTotalSupply) * result.TVL;
    return {
      // pairaddress: result.pairaddress,
      pairname: result.pairname,
      TVL: tvl,
      allocationweight: (emmissionshare * 100).toFixed(2),
      joePerSec: joePerSec.toFixed(2),
      APR: ((1.26 * joePerSec * 60 * 60 * 24 * 365 * 100) / 2 / tvl).toFixed(2),
      // APR: (
      //   ((((emmissionshare * masterchefsV3joePerSec) / 1e18) * 60 * 60 * 24 * 365) /
      //     (correspondingPool.jlpBalance / result.poolTotalSupply)) *
      //   result.TVL *
      //   100
      // ).toFixed(2),
      // APR: ((result.TVL / (((emmissionshare * masterchefsV3joePerSec) / 1e18) * 60 * 60 * 24 * 365)) * 100).toFixed(2),
    };
  });
  // result.pairname, result.TVL, result.allocationweight, result.joePerSec, result.APR;
  console.log(results);

  console.log(masterchefV3.totalAllocPoint);

  let allocpoints = 0;
  for (let index = 0; index < masterchefV3.pools.length; index++) {
    allocpoints += parseFloat(masterchefV3.pools[index].allocPoint);
  }

  console.log(allocpoints);
};

main();
