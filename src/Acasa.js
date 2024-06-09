import React from 'react';
import styles from './acasa.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';
import ChatGpt from './ChatGpt';
import imagineMare from './poze/imagineMare.png';  
const Acasa = () => {
  return (
    <div>
      <Meniusus />

      <div className={styles.imageContainer}>
        <img src={imagineMare} alt="Big Image" className={styles.bigImage} />
        <div className={styles.contactText}>Acasa</div>
      </div>
     <ChatGpt></ChatGpt>
      <Meniujos/>
    </div>
  );
};

export default Acasa;
