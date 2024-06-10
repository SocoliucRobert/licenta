import React from 'react';
import styles from './meniujos.module.css'; 
import facebook from './poze/facebook.png';  
import instagram from './poze/instagram.png';
import { motion } from 'framer-motion'; 

const Meniujos = () => {
  return (

    <motion.div 
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.1 }}
    >
    <div className={styles.subsolContainer}>
    
    <div className={styles.column}>
        <span className={`${styles.word} ${styles.blueWord}`}>Date de contact:</span>
        <span className={styles.word}><span className={styles.blueText}>Locație:</span> Județul Suceava, Oraș Suceava, Strada Universității, Numărul 5</span>
        <span className={styles.word}><span className={styles.blueText}>Telefon:</span> 24/7, 0123456789</span>
        <span className={styles.word}><span className={styles.blueText}>Email:</span> traveladdictionsuport@gmail.com</span>
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
    </motion.div>
  );
};

export default Meniujos;
