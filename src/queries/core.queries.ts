import { Subscription, Scalars } from "generated/exchangetypes";
import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange", { headers: {} });

const getPairsQueryDocument = gql`
  query getPairs($id_in: [String]) {
    pairs(where: { id_in: $id_in }) {
      id
      name
      reserveUSD
      totalSupply
    }
  }
`;

export const getPairs = async (pairAdresses: string[]) => {
  const params = { id_in: pairAdresses };

  const response: Subscription = await client.request(getPairsQueryDocument, params);

  return response.pairs;
};
