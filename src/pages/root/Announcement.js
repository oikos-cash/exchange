import React from 'react';
import styles from './root.module.scss';

export default () => {
  return (
    <div className={styles.announcement}>
      <a href="https://oikos.cash/crowdsale">
        Announcement: the Oikos (OKS) token sale is live!
      </a>
      <div className="x"></div>
    </div>
  );
};
