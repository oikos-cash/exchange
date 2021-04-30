import oikosJsTools from '../oikosJsTool';
import * as data from './gas.json';

export const DEFAULT_GAS_LIMIT = 1800000;
export const DEFAULT_GAS_PRICE = 500000000;
export const GWEI = 1000000000;

const getTransactionPrice = (gwei, ethPrice) => {
  return (
    Math.round(((gwei * ethPrice * DEFAULT_GAS_LIMIT) / GWEI) * 1000) / 1000
  );
};

export const getGasAndSpeedInfo = async () => {

  let [ethPrice] = await Promise.all([
    //getNetworkInfo(),
    oikosJsTools.oikosJs.ExchangeRates.rateForCurrency(oikosJsTools.ethersUtils.formatBytes32String('oBNB')),
  ]);  
  //let gasPriceLimit;
  let egsData = data; 
	egsData = egsData.default;
  ethPrice = Number(oikosJsTools.utils.formatEther(ethPrice));
  //gasPriceLimit = Number(
  //  oikosJsTools.ethersUtils.formatUnits(DEFAULT_GAS_LIMIT, 'gwei')
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
