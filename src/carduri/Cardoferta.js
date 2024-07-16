// carduri/CardOferta.jsx
import React from 'react';
import styles from './cardoferta.module.css';

const CardOferta = ({ oferta }) => {
  return (
    <div className={styles.card}>
      <img src={oferta.offer_image_url} alt={oferta.destination} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3>{oferta.destination}</h3>
        <p>Pret: ${oferta.price}</p>
        <p>{oferta.description}</p>
        <button className={styles.detailsButton}>Vezi Detalii</button>
      </div>
    </div>
  );
};

export default CardOferta;
