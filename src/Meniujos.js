import React from 'react';
import styles from './meniujos.module.css'; 
import facebook from './poze/facebook.png';  
import instagram from './poze/instagram.png';

const Meniujos = () => {
  return (
    <div className={styles.subsolContainer}>
    
      <div className={styles.column}>
        <span className={`${styles.word} ${styles.blueWord}`}>Date de contact:</span>
        <span className={styles.word}>Suceava, Strada Universității, Numărul 5</span>
        <span className={styles.word}>Telefon: 24/7 Telefon 0123456789</span>
        <span className={styles.word}>Email: traveladdiction@gmail.com</span>
      </div>

      <div className={styles.column}>
        <span className={`${styles.word} ${styles.blueWord}`}>Toate drepturile sunt rezervate</span>
        <span className={`${styles.word} ${styles.blackWord}`}>Designed by Socoliuc Ionuț-Robert</span>
      </div>

      <div className={styles.column}>
        <span className={`${styles.word} ${styles.blueWord}`}>Urmărește-ne pe:</span>
        <div className={styles.row}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src={facebook} alt="Facebook" className={styles.image} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img src={instagram} alt="Instagram" className={styles.image} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Meniujos;
