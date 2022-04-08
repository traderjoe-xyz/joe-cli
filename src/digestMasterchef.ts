import { getPairs } from "./queries/exchange.queries";
import { MasterChef } from "generated/mastercheftypes";

export interface FarmInfo {
  pairId?: string;
  pairaddress?: string;
  pairname: string;
  allocationweight?: number;
  joePerSec?: number;
  poolTotalSupply?: number;
  poolTVL: number;
  farmTVL?: number;
  APR?: number;
}
const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;

export async function digestMasterchef(
  masterchef: MasterChef,
  totalAllocPoint: number,
  totaljoePerSec: number,
  joePrice: number
): Promise<FarmInfo[]> {
  // Fetching all the corresponding pairs from the exchange subgraph
  const pairs = await getPairs(masterchef.pools.map((pool) => pool.pair));

  let results: FarmInfo[] = pairs.map((pair) => {
    return {
      pairaddress: pair.id,
      pairname: pair.name,
      poolTVL: pair.reserveUSD,
      poolTotalSupply: pair.totalSupply,
    };
  });

  //Populating infos from masterchef farm and exchange pool
  results = results.map((result) => {
    const correspondingPool = masterchef.pools.find((pool) => pool.pair === result.pairaddress);
    const emmissionshare = correspondingPool.allocPoint / totalAllocPoint;
    const joePerSec = (emmissionshare * totaljoePerSec) / 1e18;
    const tvl = (correspondingPool.jlpBalance / result.poolTotalSupply) * result.poolTVL;

    return {
      pairId: correspondingPool.id,
      pairaddress: result.pairaddress,
      pairname: result.pairname,
      poolTVL: result.poolTVL,
      farmTVL: tvl,
      allocationweight: correspondingPool.allocPoint,
      joePerSec: joePerSec,
      APR: (joePrice * joePerSec * SECONDS_IN_YEAR * 100) / tvl,
    };
  });

  return results;
}
