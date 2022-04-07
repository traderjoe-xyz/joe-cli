import { GraphQLClient, gql } from "graphql-request";
import { MasterChef, Query } from "../generated/mastercheftypes";

const client = new GraphQLClient(
  "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/masterchefv3",
  { headers: {} }
);

const testquery = gql`
  query {
    masterChefs(first: 1) {
      id
      joePerSec
      totalAllocPoint
      poolCount
      pools(where: { allocPoint_gt: 0 }) {
        id
        pair
        allocPoint
        balance
        jlpBalance
        rewarder {
          name
        }
      }
    }
  }
`;

export const getMasterchefV3 = async () => {
  const params = {};

  const response: Query = await client.request(testquery, params);

  return response.masterChefs[0];
};
