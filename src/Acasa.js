import React from 'react';
import styles from './acasa.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';
import imagineMare from './poze/imagineMare.png';  
import ChatGpt from './ChatGpt';
import Chat from './Chat';


const Acasa = () => {
  return (
    <div>
      <Chat></Chat>
      <Meniusus />
      <div className={styles.imageContainer}>
        <img src={imagineMare} alt="Big Image" className={styles.bigImage} />
        <div className={styles.formOverlay}>
          <form className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.section}>
                <label>Cautare dupa servicii</label>
                <div className={styles.checkboxGroup}>
                  <label>
                    <input type="checkbox" name="service1" /> Hotel
                  </label>
                  <label>
                    <input type="checkbox" name="service2" /> Zbor
                  </label>
                  <label>
                    <input type="checkbox" name="service3" /> Masina
                  </label>
                </div>
              </div>
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
                <label htmlFor="adults">Număr persoane</label>
                <input type="number" id="adults" placeholder="Numar persoane" min="1" />
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <button type="submit">CAUTA</button>
            </div>
          </form>
        </div>
      </div>
      <Meniujos />
    </div>
  );
};

export default Acasa;
