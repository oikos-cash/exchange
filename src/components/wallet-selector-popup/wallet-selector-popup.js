import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';

import Popup from '../popup';

import { toggleWalletSelectorPopup, changeScreen } from '../../ducks/ui';
import { connectToWallet, setSelectedWallet } from '../../ducks/wallet';
import { getCurrentWalletInfo } from '../../ducks/';

import { getExtensionUri } from '../../utils/browserUtils';
import { getEthereumNetwork } from '../../utils/metamaskTools';
import { getTronNetwork } from '../../utils/tronLinkTools';
import { INFURA_JSON_RPC_URLS } from '../../utils/networkUtils';
import synthetixJsTools from '../../synthetixJsTool';

import styles from './wallet-selector-popup.module.scss';

// const WALLET_TYPES = ['TronLink', 'Metamask', 'Trezor', 'Ledger'];
const WALLET_TYPES = ['TronLink'];

class WalletSelectorPopup extends Component {
  constructor() {
    super();
    this.state = {
      extensionUri: '',
      metamaskInstalled: false,
      tronLinkInstalled: false,
    };
    this.closePopup = this.closePopup.bind(this);
    this.goToWalletConnector = this.goToWalletConnector.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }

  componentDidMount() {
    if (window.web3) {
      this.setState({ metamaskInstalled: true });
    }
    this.setState({ extensionUri: getExtensionUri() });
    const findTronLink = () => {
      if (window.tronWeb) {
        this.setState({ tronLinkInstalled: true });
      }
    };
    findTronLink();
    this.findTronLinkInterval = setInterval(findTronLink, 200);
  }

  componentWillUnmount() {
    clearInterval(this.findTronLinkInterval);
  }

  closePopup() {
    const { toggleWalletSelectorPopup } = this.props;
    toggleWalletSelectorPopup(false);
  }

  registerMetamaskAddressListener = () => {
    const listener = throttle(this.onMetamaskAddressChange, 2000);
    if (
      synthetixJsTools.signer &&
      synthetixJsTools.signer.provider &&
      synthetixJsTools.signer.provider._web3Provider
    ) {
      synthetixJsTools.signer.provider._web3Provider.publicConfigStore.on(
        'update',
        listener
      );
    }
  };

  onMetamaskAddressChange = async data => {
    const { currentWalletInfo, setSelectedWallet } = this.props;
    if (
      currentWalletInfo.selectedWallet.toLocaleLowerCase() ===
      data.selectedAddress.toLowerCase()
    ) {
      return;
    }
    const newSelectedAddress = await synthetixJsTools.signer.getNextAddresses();
    setSelectedWallet({
      availableWallets: newSelectedAddress,
      selectedWallet: newSelectedAddress[0],
    });
  };

  async getNetwork(walletType) {
    if (walletType === 'TronLink') {
      return getTronNetwork();
    }
    return getEthereumNetwork();
  }

  goToWalletConnector(walletType) {
    return async () => {
      console.log('goToWalletConnector');
      console.log('walletType');
      const { changeScreen, connectToWallet } = this.props;
      const { extensionUri } = this.state;
      // We define a new signer
      try {
        const { name, networkId } = await this.getNetwork(walletType);
        let signerConfig = {};
        if (walletType === 'Coinbase') {
          signerConfig = {
            appName: 'Synthetix.Exchange',
            appLogoUrl: `${window.location.origin}/images/synthetix-logo-small.png`,
            jsonRpcUrl: INFURA_JSON_RPC_URLS[networkId],
            networkId,
          };
        }
        const signer = new synthetixJsTools.signers[walletType](signerConfig);
        synthetixJsTools.setContractSettings({
          networkId,
          signer,
        });
        switch (walletType) {
          // If signer is Metamask
          case 'Metamask':
            if (!window.web3 && extensionUri) {
              window.open(extensionUri);
            } else {
              // If Metamask is not set on supported network, we send an unlocked reason
              if (!name) {
                connectToWallet({
                  walletType,
                  unlocked: false,
                  unlockReason: 'MetamaskNotMainNet',
                });
                //Otherwise we get the current wallet address
              } else {
                if (window.ethereum) {
                  await window.ethereum.enable();
                }
                synthetixJsTools.setContractSettings({
                  signer,
                  networkId,
                  provider: synthetixJsTools.synthetixJs.ethers.getDefaultProvider(
                    name && name.toLowerCase()
                  ),
                });
                const accounts = await synthetixJsTools.signer.getNextAddresses();

                // If we do have a wallet address, we save it
                if (accounts.length > 0) {
                  connectToWallet({
                    walletType,
                    availableWallets: accounts,
                    selectedWallet: accounts[0],
                    unlocked: true,
                    networkId,
                  });
                  this.closePopup();
                  this.registerMetamaskAddressListener();
                } else {
                  // Otherwise we send an unlocked reason
                  connectToWallet({
                    walletType,
                    unlocked: false,
                    unlockReason: 'MetamaskNoAccounts',
                  });
                }
              }
            }
            break;

          case 'TronLink': {
            // TODO: if tronWeb.defaultAddress not set, message user that he needs to login in TronLink
            // If Metamask is not set on supported network, we send an unlocked reason
            synthetixJsTools.setContractSettings({
              signer,
              networkId,
              provider: signer.provider,
              tronWeb: window.tronWeb,
            });
            const accounts = await synthetixJsTools.signer.getNextAddresses();

            // If we do have a wallet address, we save it
            if (accounts.length > 0) {
              connectToWallet({
                walletType,
                availableWallets: accounts,
                selectedWallet: accounts[0],
                unlocked: true,
                networkId,
              });
              this.closePopup();
              // this.registerMetamaskAddressListener();
            } else {
              // Otherwise we send an unlocked reason
              connectToWallet({
                walletType,
                unlocked: false,
                unlockReason: 'TronLinkNoAccounts',
              });
            }
            break;
          }
          case 'Coinbase': {
            const accounts = await synthetixJsTools.signer.getNextAddresses();
            // If we do have a wallet address, we save it
            if (accounts && accounts.length > 0) {
              connectToWallet({
                walletType,
                availableWallets: accounts,
                selectedWallet: accounts[0],
                unlocked: true,
                networkId,
              });
              this.closePopup();
            } else {
              // Otherwise we send an unlocked reason
              connectToWallet({
                walletType,
                unlocked: false,
                unlockReason: 'CoinbaseNoAccounts',
              });
            }
            break;
          }

          // If signer is Trezor
          case 'Trezor':
            connectToWallet({
              walletType,
              unlocked: true,
              walletSelected: false,
            });
            changeScreen('connectToWallet');
            break;

          // If signer is Ledger
          case 'Ledger':
            connectToWallet({
              walletType,
              unlocked: true,
              walletSelected: false,
            });
            changeScreen('connectToWallet');
            break;
          default:
            connectToWallet({
              unlocked: false,
            });
        }
      } catch (e) {
        console.error(e);
      }
    };
  }

  renderButton(walletType) {
    const { metamaskInstalled, tronLinkInstalled } = this.state;
    let walletName = walletType;
    let disabled = false;
    if (walletType === 'Metamask' && !metamaskInstalled) {
      disabled = true;
      walletName = 'Metamask (not installed)';
    }
    if (walletType === 'TronLink' && !tronLinkInstalled) {
      disabled = true;
      walletName = 'TronLink (not installed)';
    }
    if (walletType === 'Coinbase') {
      walletName = 'Coinbase Wallet';
    }
    return (
      <button
        onClick={this.goToWalletConnector(walletType)}
        key={walletType}
        className={styles.button}
        disabled={disabled}
      >
        <div className={styles.buttonInner}>
          <img
            height={51}
            src={`images/wallets/${walletType.toLowerCase()}-medium.svg`}
            alt={`${walletType} icon`}
          />
          <div className={styles.walletDescription}>
            <div className={styles.walletDescriptionHeading}>{walletName}</div>
          </div>
        </div>
      </button>
    );
  }

  render() {
    const { isVisible } = this.props;
    return (
      <Popup isVisible={isVisible} closePopup={this.closePopup}>
        <div>
          <h1>Connect a Wallet</h1>
          <div className={styles.buttonsWrapper}>
            {WALLET_TYPES.map(this.renderButton)}
          </div>
        </div>
      </Popup>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
  };
};

const mapDispatchToProps = {
  toggleWalletSelectorPopup,
  changeScreen,
  connectToWallet,
  setSelectedWallet,
};

WalletSelectorPopup.propTypes = {
  toggleWalletSelectorPopup: PropTypes.func.isRequired,
  changeScreen: PropTypes.func.isRequired,
  connectToWallet: PropTypes.func.isRequired,
  setSelectedWallet: PropTypes.func.isRequired,
  currentWalletInfo: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletSelectorPopup);
