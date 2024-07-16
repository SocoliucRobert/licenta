import React from 'react';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './adminhoteluri.module.css';

const Adminuser = () => {
  return (
    <div className={styles.adminContainer}>
      <Meniusus />

      <div className={styles.mainArea}>
        <div className={styles.leftSidebar}>
          <div className={styles.menu}>
            <div className={styles.menuHeader}>Panou Admin</div>
            <ul>
              <li><a href="#">ADAUGARE HOTEL</a></li>
              <li><a href="#">ADAUGARE ZBOR</a></li>
              <li><a href="#">ADAUGARE MASINA</a></li>
              <li><a href="#">ADAUGARE OFERTA</a></li>
              <li><a href="#">EDITARE HOTEL</a></li>
              <li><a href="#">EDITARE ZBOR</a></li>
              <li><a href="#">EDITARE MASINA</a></li>
              <li><a href="#">EDITARE OFERTA</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.content}>
          {/* Your main content area goes here */}
          <h2>Main Content Area</h2>
          <p>This is where your main content will go.</p>
        </div>
      </div>

      <Meniujos />
    </div>
  );
};

export default Adminuser;
