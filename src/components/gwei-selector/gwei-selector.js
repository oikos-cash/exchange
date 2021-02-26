import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setTransactionSpeed } from '../../ducks/wallet';
import { getTransactionSettings } from '../../ducks/';

import styles from './gwei-selector.module.scss';

const getSpeedLabel = label => {
  if (label === 'slowAllowed') return 'slow';
  if (label === 'averageAllowed') return 'average';
  if (label === 'fastestAllowed') return 'fastest allowed';
  return label;
};

class GweiSelector extends Component {
  onSpeedChange(speed) {
    return () => {
      const { setTransactionSpeed } = this.props;
      setTransactionSpeed(speed);
    };
  }

  render() {
    const { transactionSettings, hasGweiLimit } = this.props;
    const { transactionSpeed, gasAndSpeedInfo } = transactionSettings;
    //const gasPriceLimit =
    //  gasAndSpeedInfo && gasAndSpeedInfo.fastestAllowed
    //    ? gasAndSpeedInfo.fastestAllowed.gwei
    //    : null;

    const speedArray = hasGweiLimit
      ? ['slowAllowed', 'averageAllowed', 'fastestAllowed']
      : ['slow', 'average', 'fast'];
    return (
      <div className={styles.gweiSelectorWrapper}>
        <div className={styles.gweiSelectorHeading}>
         {/*} Transaction speed
          {hasGweiLimit ? (
            <div className={styles.gweiSelectorHeadingMaxLimit}>
              (<span>{gasPriceLimit} gwei max</span>)
            </div>
          ) : null}*/}
        </div>
        <div className={styles.gweiSelectorRow}>
          {speedArray.map((speed, i) => {
            return (
              <div
                key={i}
                onClick={this.onSpeedChange(speed)}
                className={`${styles.gweiSelector} ${
                  transactionSpeed === speed ? styles.selected : ''
                }`}
              >
                {getSpeedLabel(speed)}
                <div className={styles.gweiSelectorPrice}>
                  ${gasAndSpeedInfo ? gasAndSpeedInfo[speed].price : 0} (
                  {gasAndSpeedInfo ? gasAndSpeedInfo[speed].gwei : 0} gwei)
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const txSettings = getTransactionSettings(state);
  console.log(txSettings);
  txSettings.transactionSpeed = 'average';
  return {
    transactionSettings: getTransactionSettings(state),
  };
};

const mapDispatchToProps = {
  setTransactionSpeed,
};

GweiSelector.propTypes = {
  transactionSettings: PropTypes.object.isRequired,
  setTransactionSpeed: PropTypes.func.isRequired,
  hasGweiLimit: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GweiSelector);
