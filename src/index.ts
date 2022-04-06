import { TestQuery } from "./queries/query";

const main = async () => {
  const masterchefs = await TestQuery();

  console.log(masterchefs[0]);
};

main();
