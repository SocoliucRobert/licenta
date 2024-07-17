import React from 'react';
import { Link } from 'react-router-dom';
import styles from './cardoferta.module.css';

const CardOferta = ({ oferta }) => {
  return (
    <div className={styles.card}>
      <img src={oferta.offer_image_url} alt={oferta.destination} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3>{oferta.destination}</h3>
        <p>Pret: ${oferta.price}</p>
        <p>{oferta.description}</p>
        <Link to={`/oferta/${oferta.id}`} className={styles.detailsButton}>
          Vezi Detalii
        </Link>
      </div>
    </div>
  );
};

export default CardOferta;
