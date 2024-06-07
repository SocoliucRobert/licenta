import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import styles from './meniusus.module.css';
import baraImage from './poze/bara.png';
import imagelogo from './poze/imagineLogo.png';  
import butonLogare from './poze/butonLogare.png';  

const Meniusus = () => {
  return (
    <div>
      <div className={styles.topBar}>
        <div className={styles.logoContainer}>
          <img src={imagelogo} alt="Imagine Logo" className={styles.logo} />
          <span className={styles.brand}>TRAVEL ADDICTION</span>
        </div>
        <div className={styles.loginButton}>
        <Link to="/Login">
            <img src={butonLogare} alt="Logare Button" className={styles.buttonImage} />
            <span className={styles.buttonText}>LOGARE</span>
          </Link>
        </div>
      </div>
      <div className={styles.header}>
        <img src={baraImage} alt="Travel" className={styles.image} />
        <div className={styles.wordsContainer}>
          <Link to="/Acasa" className={styles.link}><span className={styles.word}>ACASA</span></Link>
          <Link to="/Hoteluri" className={styles.link}><span className={styles.word}>HOTELURI</span></Link>
          <Link to="/Zboruri" className={styles.link}><span className={styles.word}>ZBORURI</span></Link>
          <Link to="/InchirieriAuto" className={styles.link}><span className={styles.word}>INCHIRIERI AUTO</span></Link>
          <Link to="/Oferte" className={styles.link}><span className={styles.word}>OFERTE</span></Link>
          <Link to="/Contact" className={styles.link}><span className={styles.word}>CONTACT</span></Link>
        </div>
      </div>
    </div>
  );
};

export default Meniusus;
