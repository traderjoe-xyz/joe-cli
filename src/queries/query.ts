import { GraphQLClient, gql } from "graphql-request";
import { MasterChef, Query } from "../generated/graphqltypes";

const client = new GraphQLClient("https://api.thegraph.com/subgraphs/name/traderjoe-xyz/masterchefv2", { headers: {} });

const testquery = gql`
  #   query Masterchef()
  query {
    masterChefs(first: 1) {
      id
      devAddr
      treasuryAddr
      investorAddr
    }
  }
`;

export const TestQuery = async () => {
  const params = {};

  const response: Query = await client.request(testquery, params);

  return response.masterChefs;
};
