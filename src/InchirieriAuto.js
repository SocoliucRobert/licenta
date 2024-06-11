import React from 'react';
import styles from './inchirieriauto.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';
import imagineMare from './poze/imagineMare.png';
import { useState } from 'react';
import ChatGpt from './ChatGpt';

const InchirieriAuto = () => {
  const [price, setPrice] = useState(0);
  return (
    <div>
      <ChatGpt/>
      <Meniusus />
      <div className={styles.imageContainer}>
        <img src={imagineMare} alt="Big Image" className={styles.bigImage} />
        <div className={styles.formOverlay}>
          <form className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.section}>
                <label htmlFor="pickupLocation">Locație preluare</label>
                <input type="text" id="pickupLocation" placeholder="Locație preluare" />
              </div>
              <div className={styles.section}>
                <label htmlFor="returnLocation">Locație returnare</label>
                <input type="text" id="returnLocation" placeholder="Locație returnare" />
              </div>
              <div className={styles.section}>
                <label htmlFor="pickupDate">Data preluare</label>
                <input type="date" id="pickupDate" />
              </div>
              <div className={styles.section}>
                <label htmlFor="returnDate">Data returnare</label>
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
      <div className={styles.priceFilter}>
            <label htmlFor="priceRange">Filtrare preț:</label>
            <input
              type="range"
              id="priceRange"
              min="0"
              max="50000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <div>Preț selectat: {price} lei</div>
            <button className={styles.applyButton}>Aplicare</button>
          </div>
      <Meniujos />
    </div>
  );
};

export default InchirieriAuto;
