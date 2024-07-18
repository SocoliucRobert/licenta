import React from 'react';
import { Link } from 'react-router-dom';
import styles from './cardoferta.module.css';

const CardOferta = ({ oferta }) => {
  return (
    <div className={`${styles.card} ${styles.hoverEffect}`}>
      <img src={oferta.offer_image_url} alt={oferta.destination} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3>{oferta.destination}</h3>
        <p>Preț: {oferta.price} lei</p>
        <p>{oferta.description}</p>
        <Link to={`/oferta/${oferta.id}`} className={styles.detailsButton}>
          Vezi Detalii
        </Link>
      </div>
    </div>
  );
};

export default CardOferta;
