// TODO @kev .. need to setup that backend api
const SYNTHETIX_API_URL_BY_NETWORKS = {
  1: process.env.GRAPH_API_URL_MAIN,
  2: process.env.GRAPH_API_URL,
};

export const getTransactions = async networkId => {
  console.log('networkId', networkId);
  const apiBaseUri = SYNTHETIX_API_URL_BY_NETWORKS[networkId] || SYNTHETIX_API_URL_BY_NETWORKS[2];
  const uri = `${apiBaseUri}/api/blockchainEvents/SynthExchange/`;
  const results = await fetch(uri);
  return results.json();
};
