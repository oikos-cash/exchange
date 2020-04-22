import throttle from 'lodash/throttle';

export const SUPPORTED_NETWORKS = {
  1: 'mainnet',
  2: 'shasta',
};

export async function getTronNetwork() {
  // TODO: @kev change shasta to mainnet
  const defaultNetwork = { name: 'mainnet', networkId: '1' };

  if (!window.tronWeb) {
    return defaultNetwork;
  }
  const apiHost = window.tronWeb.fullNode.host;
  const matches = apiHost.match(/https:\/\/api\.([^.]*)\.trongrid.io/);

  if (!matches) return defaultNetwork;
  const name = matches[1];

  const networkId = Object.keys(SUPPORTED_NETWORKS).filter(
    networkId => SUPPORTED_NETWORKS[networkId] === name
  )[0];

  return { name, networkId };
}

// TODO
export function registerTronLinkAddressListener(cb) {
  if (!window.tronWeb) return;
  const listener = throttle(cb, 1000);
  window.tronWeb.publicConfigStore.on('update', listener);
}
