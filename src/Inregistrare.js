import React from 'react';
import { Link } from 'react-router-dom';
import styles from './inregistrare.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';

import imagineMare from './poze/imagineMare.png';
import facebookIcon from './poze/facebooklogin.png'; 
import googleIcon from './poze/googlelogin.png'; 

const Inregistrare = () => {
  return (
    <div>
      <Meniusus />
      <div className={styles.imageContainer}>
        <img src={imagineMare} alt="Big Image" className={styles.bigImage} />
        <div className={styles.inregistrareText}>ÎNREGISTRARE</div>
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
            <button type="submit">Inregistrare</button>
          </div>
         
          <div className={styles.socialLogin}>
            <div className={styles.socialLoginText}>sau folositi una dintre opțiunile:</div>
            <div className={styles.loginIcons}>
            
              <img src={googleIcon} alt="Google" className={styles.loginIcon} />
              <img src={facebookIcon} alt="Facebook" className={styles.loginIcon} />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <span><Link to="/Login">Ai deja cont? Intră in cont</Link></span>
        </div>
      </div>
      <Meniujos />
    </div>
  );
};

export default Inregistrare;
