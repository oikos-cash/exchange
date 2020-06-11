import React from 'react';
import styles from './root.module.scss';

export default () => {
  return (
    <div className={styles.announcement}>
      <a href="https://support.hoo.com/hc/en-us/articles/900001258163">
        Announcement: Oikos IEO on Hoo.com from Jun 12 to Jun 14 🚀
      </a>
      <div className="x"></div>
    </div>
  );
};
