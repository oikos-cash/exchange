const SYNTHETIX_API_URL_BY_NETWORKS = { 
  56: 'https://api-bsc.oikos.exchange/api/',
  97: 'https://api-bsc-testnet.oikos.exchange/api/',
};

export const getTransactions = async networkId => {
  const apiBaseUri = networkId
    ? SYNTHETIX_API_URL_BY_NETWORKS[networkId]
    : SYNTHETIX_API_URL_BY_NETWORKS[56];
  const uri = `${apiBaseUri}blockchainEvents/SynthExchange/`;
  const results = await fetch(uri);
  return results.json();
};
