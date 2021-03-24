import React from 'react';
import styles from './root.module.scss';

export default () => {
  return (
    <div className={styles.announcement}>
			<a href="https://oikoscash.medium.com/oikos-migrates-to-bsc-mainnet-d3f8f1271ea7">
				Oikos is migrating to Binance Smart Chain (BSC). Your action is needed. Click to read more. 🚀
        <div className="x"></div>
      </a>
    </div>
  );
};
