import React from 'react';
import { Link } from 'react-router-dom';
import styles from './resetareparola.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';

import imagineMare from './poze/imagineMare.png';
import facebookIcon from './poze/facebooklogin.png'; 
import googleIcon from './poze/googlelogin.png'; 

const Resetareparola = () => {
  return (
    <div>
      <Meniusus />
      <div className={styles.imageContainer}>
        <img src={imagineMare} alt="Big Image" className={styles.bigImage} />
        <div className={styles.resetareText}>RESETARE PAROLA</div>
      </div>
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Adresă de e-mail</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Parolă</label>
            <input type="password" id="password" name="password" />
          </div>
          <div className={styles.formGroup}>
            <button type="submit3">Reseteaza parola</button>
          </div>
         
        
        </div>
        <div className={styles.footer}>
        </div>
      </div>
      <Meniujos />
    </div>
  );
};

export default Resetareparola;
