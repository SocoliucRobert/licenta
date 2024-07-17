import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import styles from './cardhotel.module.css';

const CardHotel = ({ hotel }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % hotel.image_urls.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [hotel.image_urls.length]);

  return (
    <div className={styles.card}>
      <img
        src={hotel.image_urls[currentImageIndex]}
        alt={hotel.name}
        className={styles.cardImage}
      />
      <div className={styles.cardContent}>
        <h3>{hotel.name}</h3>
        <p>{hotel.address}</p>
        <p>Număr de stele: {hotel.stars}</p>
        <p>Preț de persoană: {hotel.price_per_adult} lei</p>
        <Link to={`/hotel/${hotel.id}`} className={styles.detailsButton}>Vezi Detalii</Link>
      </div>
    </div>
  );
};

export default CardHotel;
