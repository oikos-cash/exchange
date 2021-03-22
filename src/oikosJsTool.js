import { OikosJs } from '@oikos/oikos-js-bsc';

console.log(new OikosJs({}));

let OikosJsTools = {
  initialized: false,
  signers: OikosJs.signers,
  setContractSettings: function(contractSettings) {
    this.oikosJs = new OikosJs(contractSettings);
    this.signer = this.oikosJs.contractSettings.signer;
    this.provider = this.oikosJs.contractSettings.provider;
    this.util = this.oikosJs.util;
    this.utils = this.oikosJs.utils;
    this.ethersUtils = OikosJs.utils;
    this.initialized = true;
  },
  getUtf8Bytes: function(str) {
    return OikosJsTools.ethersUtils.formatBytes32String(str);
  },
};

export default OikosJsTools;
