import synthetixJsTools from '../synthetixJsTool';
import * as data from './gas.json';

export const DEFAULT_GAS_LIMIT = 1800000;
export const DEFAULT_GAS_PRICE = 2000000000;
export const GWEI = 1000000000;

const getTransactionPrice = (gwei, ethPrice) => {
  return (
    Math.round(((gwei * ethPrice * DEFAULT_GAS_LIMIT) / GWEI) * 1000) / 1000
  );
};

export const getGasAndSpeedInfo = async () => {

  let [ethPrice] = await Promise.all([
    //getNetworkInfo(),
    synthetixJsTools.synthetixJs.ExchangeRates.rateForCurrency(synthetixJsTools.ethersUtils.formatBytes32String('sBNB')),
  ]);  
  //let gasPriceLimit;
  let egsData = data; 
	egsData = egsData.default;
  ethPrice = Number(synthetixJsTools.utils.formatEther(ethPrice));
  //gasPriceLimit = Number(
  //  synthetixJsTools.ethersUtils.formatUnits(DEFAULT_GAS_LIMIT, 'gwei')
  //);
  console.log(egsData)
  const fastGwei = egsData.fast / 10;
  const averageGwei = egsData.average / 10;
  const slowGwei = egsData.safeLow / 10;

  return {
    fastestAllowed: {
      gwei: fastGwei,
      price: getTransactionPrice(fastGwei, ethPrice),
    },
    averageAllowed: {
      gwei: averageGwei,
      price: getTransactionPrice(averageGwei, ethPrice),
    },
    slowAllowed: {
      gwei: slowGwei,
      price: getTransactionPrice(slowGwei, ethPrice),
    },
    fast: {
      gwei: fastGwei,
      price: getTransactionPrice(fastGwei, ethPrice),
    },
    average: {
      gwei: averageGwei,
      price: getTransactionPrice(averageGwei, ethPrice),
    },
    slow: {
      gwei: slowGwei,
      price: getTransactionPrice(slowGwei, ethPrice),
    },
  };
};
