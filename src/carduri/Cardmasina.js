import React from 'react';
import styles from './cardmasina.module.css';

const Cardmasina = ({ masina }) => {
  return (
    <div className={styles.card}>
      <img src={masina.photo_url} alt={`Photo of ${masina.car_name}`} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3>{masina.car_name}</h3>
        <p>Locație: {masina.car_location}</p>
        <p>Kilometraj: {masina.mileage}</p>
        <p>Tip transmisie: {masina.transmission_type}</p>
        <p>Tip combustibil: {masina.fuel_type}</p>
        <p>Număr de locuri: {masina.number_of_seats}</p>
        <p>Preț pe zi: ${masina.price_per_day}</p>
        {/* You can add more details if needed */}
        <button className={styles.detailsButton}>Vezi Detalii</button>
      </div>
    </div>
  );
};

export default Cardmasina;
