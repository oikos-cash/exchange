import throttle from 'lodash/throttle';

export const SUPPORTED_NETWORKS = {
  56: 'bsc',
  97: 'bsctestnet',
};

export async function getEthereumNetwork() {
  return await new Promise(function (resolve) {
    if (!window.web3) {
      return resolve({ name: 'bsc', networkId: '56' });
    }
    return resolve({ name: 'bsc', networkId: '56' });
    // TODO: window.web3 is deprecated
    // FIXME
    /*
    window.web3.version.getNetwork((err, networkId) => {
      if (err) {
        reject(err);
      } else {
        const name = SUPPORTED_NETWORKS[networkId];
        resolve({ name, networkId });
      }
    });
    */
  });
}

export function registerMetamaskAddressListener(cb) {
  if (!window.ethereum) {
    return;
  }
  const listener = throttle(cb, 1000);
  window.ethereum.publicConfigStore.on('update', listener);
}
