// carduri/CardZbor.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './cardzbor.module.css';

const CardZbor = ({ flight }) => {
  return (
    <div className={styles.card}>
      <img src={flight.airline_logo_url} alt="Airline Logo" className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3>Zbor de la {flight.departure_location} la {flight.arrival_location}</h3>
        <p>Preț pe persoană: {flight.price_per_person} lei </p>
        <Link to={`/flight/${flight.id}`} className={styles.detailsButton}>Vezi Detalii</Link>
      </div>
    </div>
  );
};

export default CardZbor;
