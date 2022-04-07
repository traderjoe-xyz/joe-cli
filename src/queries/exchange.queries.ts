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

const getJoePriceQueryDocument = gql`
  query {
    pairs(where: { id: "0x3bc40d4307cd946157447cd55d70ee7495ba6140" }) {
      id
      name
      token1Price
    }
  }
`;

export const getJoePrice = async () => {
  const response: Subscription = await client.request(getJoePriceQueryDocument);

  return response.pairs[0].token1Price;
};
