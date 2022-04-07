import { GraphQLClient, gql } from "graphql-request";
import { Query } from "../generated/mastercheftypes";

const client = new GraphQLClient(
  "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/masterchefv2",
  { headers: {} }
);

const getMasterchefV2QueryDocument = gql`
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
        jlpBalance
        rewarder {
          name
        }
      }
    }
  }
`;

export const getMasterchefV2 = async () => {
  const response: Query = await client.request(getMasterchefV2QueryDocument);

  return response.masterChefs[0];
};
