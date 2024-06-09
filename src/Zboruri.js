import React from 'react';
import styles from './zboruri.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';
import imagineMare from './poze/imagineMare.png';

const Zboruri = () => {
  return (
    <div>
      <Meniusus />
      <div className={styles.imageContainer}>
        <img src={imagineMare} alt="Big Image" className={styles.bigImage} />
        <div className={styles.formOverlay}>
          <form className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.section}>
                <label htmlFor="departureCity">Plecare</label>
                <input type="text" id="departureCity" placeholder="Oras de plecare" />
              </div>
              <div className={styles.section}>
                <label htmlFor="arrivalCity">Destinație</label>
                <input type="text" id="arrivalCity" placeholder="Oras de destinație" />
              </div>
              <div className={styles.section}>
                <label htmlFor="departureDate">Data Plecării</label>
                <input type="date" id="departureDate" />
              </div>
              <div className={styles.section}>
                <label htmlFor="returnDate">Data Întoarcerii</label>
                <input type="date" id="returnDate" />
              </div>
              <div className={styles.section}>
                <label htmlFor="numarPersoane">Număr persoane</label>
                <input type="number" id="numarPersoane" placeholder="Număr persoane" min="1" />
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <button type="submitt">CAUTA</button>
            </div>
          </form>
        </div>
      </div>
      <Meniujos/>
    </div>
  );
};

export default Zboruri;
