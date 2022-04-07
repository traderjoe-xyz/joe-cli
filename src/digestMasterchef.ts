import { getPairs } from "./queries/exchange.queries";
import { MasterChef } from "generated/mastercheftypes";

export interface Result {
  pairaddress?: string;
  pairname: string;
  allocationweight?: string;
  joePerSec?: string;
  poolTotalSupply?: number;
  TVL: number;
  APR?: string;
}
const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;

export async function digestMasterchef(
  masterchef: MasterChef,
  totalAllocPoint,
  totaljoePerSec,
  joePrice
): Promise<Result[]> {
  const Boostedpairs = await getPairs(masterchef.pools.map((pool) => pool.pair));

  let Boostedresults: Result[] = Boostedpairs.map((pair) => {
    return {
      pairaddress: pair.id,
      pairname: pair.name,
      TVL: pair.reserveUSD,
      poolTotalSupply: pair.totalSupply,
    };
  });
  Boostedresults = Boostedresults.map((result) => {
    const correspondingPool = masterchef.pools.find((pool) => pool.pair === result.pairaddress);

    const emmissionshare = correspondingPool.allocPoint / totalAllocPoint;
    const joePerSec = (emmissionshare * totaljoePerSec) / 1e18;
    const tvl = (correspondingPool.jlpBalance / result.poolTotalSupply) * result.TVL;
    return {
      pairaddress: result.pairaddress,
      pairname: result.pairname,
      TVL: tvl,
      allocationweight: (emmissionshare * 100).toFixed(2),
      joePerSec: joePerSec.toFixed(2),
      APR: ((joePrice * joePerSec * SECONDS_IN_YEAR * 100) / 2 / tvl).toFixed(2),
    };
  });

  return Boostedresults;
}
