import throttle from 'lodash/throttle';

export const SUPPORTED_NETWORKS = {
  1: 'mainnet',
  2: 'shasta',
  3: 'nile'
};

export async function getTronNetwork() {
	// TODO: @kev change shasta to mainnet
	const defaultNetwork = { name: 'nile', networkId: '3' };

	if (!window.tronWeb) {
		return defaultNetwork;
	}
	const apiHost = window.tronWeb.fullNode.host;
	console.log(`apiHost is ${apiHost}`)
	const matches = apiHost.match(/https:\/\/api\.([^.]*)\.nilex.io/);
	// TODO: more robust: query block 0 to detect network

	//if (!matches) return defaultNetwork;
	const name = "nile" //matches[1];

	const networkId = Object.keys(SUPPORTED_NETWORKS).filter(
		networkId => SUPPORTED_NETWORKS[networkId] === name
	)[0];

	return { name, networkId };
}
