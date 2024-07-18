import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './cardzbor.module.css';

const CardZbor = ({ flight }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300); // reset click dupa 300ms
  };

  return (
    <div className={`${styles.card} ${isClicked ? styles.clicked : ''}`} onClick={handleClick}>
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
