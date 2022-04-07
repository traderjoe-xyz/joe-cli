import { GraphQLClient, gql } from "graphql-request";
import { Query } from "../generated/mastercheftypes";

const client = new GraphQLClient(
  "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/boosted-master-chef",
  {
    headers: {},
  }
);

const getBoostedMasterchefQueryDocument = gql`
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
        accJoePerShare
        rewarder {
          name
        }
      }
    }
  }
`;

export const getBoostedMasterchef = async () => {
  const params = {};

  const response: Query = await client.request(getBoostedMasterchefQueryDocument, params);

  return response.masterChefs[0];
};
