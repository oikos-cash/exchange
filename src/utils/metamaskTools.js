import throttle from 'lodash/throttle';

export const SUPPORTED_NETWORKS = {
  1: 'MAINNET',
  2: 'SHASTA',
  3: 'NILE',
};

export async function getEthereumNetwork() {
  return await new Promise(function(resolve, reject) {
    if (!window.web3) {
      return resolve({ name: 'SHASTA', networkId: '2' });
    }
    window.web3.version.getNetwork((err, networkId) => {
      if (err) {
        reject(err);
      } else {
        const name = SUPPORTED_NETWORKS[networkId];
        resolve({ name, networkId });
      }
    });
  });
}

export function registerMetamaskAddressListener(cb) {
  if (!window.ethereum) {
    return;
  }
  const listener = throttle(cb, 1000);
  window.ethereum.publicConfigStore.on('update', listener);
}
