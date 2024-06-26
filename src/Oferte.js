import React from 'react';
import styles from './oferte.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';
import imagineMare from './poze/imagineMare.png';
import { useState } from 'react';
import ChatGpt from './ChatGpt';
const Oferte = () => {
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
                <label htmlFor="destination">Destinație</label>
                <input type="text" id="destination" placeholder="Destinație" />
              </div>
              <div className={styles.section}>
                <label htmlFor="checkInDate">Perioada</label>
                <div className={styles.dateInputs}>
                  <input type="date" id="checkInDate" />
                  <input type="date" id="checkOutDate" />
                </div>
              </div>
              <div className={styles.section}>
                <label htmlFor="numarPersoane">Număr persoane</label>
                <input type="number" id="numarPersoane" placeholder="Număr persoane" min="1" />
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <button type="submit">CAUTA</button>
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

export default Oferte;
