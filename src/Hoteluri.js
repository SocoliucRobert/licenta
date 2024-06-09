
import styles from './hoteluri.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';
import imagineMare from './poze/imagineMare.png';  
import React from 'react';

const Hoteluri = () => {
  return (
    <div>
      <Meniusus />
      <div className={styles.imageContainer}>
        <img src={imagineMare} alt="Big Image" className={styles.bigImage} />
        <div className={styles.formOverlay}>
          <form className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.section}>
                <label htmlFor="city">Hotel</label>
                <input type="text7" id="city" placeholder="Oras" />
              </div>
              <div className={styles.section}>
                <label htmlFor="checkInDate">Perioada</label>
                <div className={styles.dateInputs}>
                  <input type="date" id="checkInDate" />
                  <input type="date" id="checkOutDate" />
                </div>
              </div>
              <div className={styles.section}>
                <label htmlFor="adults">Număr persoane</label>
                <div className={styles.peopleInputs}>
                  <input type="number" id="adults" placeholder="Adulti" min="1" />
                  <input type="number" id="children" placeholder="Copii" min="0" />
                </div>
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

export default Hoteluri;
