import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Container from '../../components/container';
import BalanceChecker from '../../components/balance-checker';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import TradingWidget from '../../components/trading-widget';
import TransactionsTable from '../../components/transactions-table';

import {
  walletSelectorPopupIsVisible,
  transactionStatusPopupIsVisible,
  testnetPopupIsVisible,
  depotPopupIsVisible,
  feedbackPopupIsVisible,
  walkthroughPopupIsVisible,
  loadingScreenIsVisible,
  getCurrentWalletInfo,
  getAvailableSynths,
  getSynthToExchange,
  getSynthToBuy,
  getCurrentExchangeMode,
} from '../../ducks/';

import styles from './exchange.module.scss';

class Exchange extends Component {
  getSymbol() {
    const { synthToBuy, synthToExchange } = this.props;

    if (!synthToBuy || !synthToExchange) return;
    console.log(
      synthToBuy.name,
      synthToBuy.category,
      synthToExchange.name,
      synthToExchange.category
    );

    if (synthToBuy.category === 'commodity') {
      return synthToExchange.name.substring(1) + synthToBuy.name.substring(1);
    } else if (
      synthToBuy.category === 'crypto' &&
      synthToExchange.category === 'forex'
    ) {
      return synthToBuy.name.substring(1) + synthToExchange.name.substring(1);
    } else if (
      synthToBuy.category === 'forex' &&
      synthToExchange.category === 'crypto'
    ) {
      return synthToExchange.name.substring(1) + synthToBuy.name.substring(1);
    } else if (
      synthToBuy.category == 'crypto' &&
      synthToExchange.category == 'crypto'
    ) {
      if (synthToBuy.name == 'sBTC' && synthToExchange.name == 'sTRX') {
        return synthToExchange.name.substring(1) + synthToBuy.name.substring(1);
      }
      if (synthToBuy.name == 'sETH' && synthToExchange.name == 'sTRX') {
        return synthToExchange.name.substring(1) + synthToBuy.name.substring(1);
      }
      if (
        (synthToBuy.name == 'sTRX' && synthToExchange.name == 'iTRX') ||
        (synthToBuy.name == 'iTRX' && synthToExchange.name == 'sTRX') ||
        (synthToBuy.name == 'sTRX' && synthToExchange.name == 'sTRX')
      ) {
        return 'TRX' + 'USD';
      }
      if (synthToBuy.name == 'iBTC' && synthToExchange.name == 'sTRX') {
        return 'TRX' + 'BTC';
      }
      if (synthToBuy.name == 'iETH' && synthToExchange.name == 'sTRX') {
        return 'TRX' + 'ETH';
      }
      if (synthToBuy.name == 'sTRX' && synthToExchange.name == 'iTRX') {
        return 'TRX' + 'USD';
      }
      if (synthToBuy.name == 'sBTC' && synthToExchange.name == 'sETH') {
        return 'TRX' + 'ETH';
      }
      if (synthToBuy.name == 'iBTC' && synthToExchange.name == 'sETH') {
        return 'ETH' + 'BTC';
      } 
      if (
        (synthToBuy.name == 'sBTC' && synthToExchange.name == 'iBTC') ||
        (synthToExchange.name == 'sBTC' && synthToBuy.name == 'iBTC')
      ) {
        return 'BTC' + 'USD';
      }
    }
    return synthToBuy.name.substring(1) + synthToExchange.name.substring(1);
  }

  renderBasicModeContent() {
    const { synthToBuy, synthToExchange } = this.props;
    return (
      <div className={styles.exchangeLayoutColumn}>
        {synthToBuy && synthToExchange ? (
          <Container fullHeight={true}>
            <TradingWidget />
          </Container>
        ) : null}
      </div>
    );
  }

  renderProModeContent() {
    const { synthToBuy, synthToExchange } = this.props;
    const symbol = this.getSymbol();
    console.log(symbol);
    return (
      <div className={styles.exchangeLayoutColumn}>
        <div className={styles.exchangeLayoutRow}>
          <div className={styles.chartWrapper}>
            <div className={styles.mask} />
            <TradingViewWidget
              symbol={symbol}
              theme={Themes.DARK}
              autosize
              allow_symbol_change={false}
              hide_legend={false}
              save_image={false}
            />
          </div>
          <div
            className={`${styles.exchangeLayoutColumn} ${styles.exchangeLayoutColumnSmall} ${styles.exchangeLayoutColumnRight}`}
          >
            {synthToBuy && synthToExchange ? (
              <Container fullHeight={true}>
                <TradingWidget />
              </Container>
            ) : null}
          </div>
        </div>
        <TransactionsTable />
      </div>
    );
  }

  render() {
    const { currentExchangeMode } = this.props;

    return (
      <div className={styles.exchange}>
        <div className={styles.exchangeLayout}>
          <div
            className={`${styles.exchangeLayoutColumn} ${styles.exchangeLayoutColumnSmall} ${styles.exchangeLayoutColumnLeft}`}
          >
            <Container fullHeight={true}>
              <BalanceChecker />
            </Container>
          </div>
          {currentExchangeMode === 'basic'
            ? this.renderBasicModeContent()
            : this.renderProModeContent()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    walletSelectorPopupIsVisible: walletSelectorPopupIsVisible(state),
    transactionStatusPopupIsVisible: transactionStatusPopupIsVisible(state),
    testnetPopupIsVisible: testnetPopupIsVisible(state),
    depotPopupIsVisible: depotPopupIsVisible(state),
    feedbackPopupIsVisible: feedbackPopupIsVisible(state),
    walkthroughPopupIsVisible: walkthroughPopupIsVisible(state),
    loadingScreenIsVisible: loadingScreenIsVisible(state),
    currentWalletInfo: getCurrentWalletInfo(state),
    availableSynths: getAvailableSynths(state),
    synthToBuy: getSynthToBuy(state),
    synthToExchange: getSynthToExchange(state),
    currentExchangeMode: getCurrentExchangeMode(state),
  };
};

const mapDispatchToProps = {};

Exchange.propTypes = {
  walletSelectorPopupIsVisible: PropTypes.bool.isRequired,
  transactionStatusPopupIsVisible: PropTypes.bool.isRequired,
  testnetPopupIsVisible: PropTypes.bool.isRequired,
  depotPopupIsVisible: PropTypes.bool.isRequired,
  feedbackPopupIsVisible: PropTypes.bool.isRequired,
  walkthroughPopupIsVisible: PropTypes.bool.isRequired,
  loadingScreenIsVisible: PropTypes.bool.isRequired,
  currentWalletInfo: PropTypes.object.isRequired,
  availableSynths: PropTypes.array.isRequired,
  synthToBuy: PropTypes.object,
  synthToExchange: PropTypes.object,
  currentExchangeMode: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Exchange);
