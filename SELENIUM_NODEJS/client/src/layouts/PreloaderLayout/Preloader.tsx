// src/layouts/PreloaderLayout/Preloader.tsx

import React from 'react';
import styles from './Preloader.module.css';

const Preloader: React.FC = () => {
  return (
    <div className={styles.preloader}>
      <span className={styles.spinner}></span>
      <div className={styles.loader}></div>
      <p>Loading...</p>
    </div>
  );
};

export default Preloader;
