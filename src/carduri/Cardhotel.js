import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './cardhotel.module.css';

const CardHotel = ({ hotel }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % hotel.image_urls.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [hotel.image_urls.length]);

  const handleCardClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 300); // Adjust the duration to match your CSS animation duration
  };

  const renderStars = (stars) => {
    return (
      <div className={styles.stars}>
        {Array.from({ length: stars }, (_, index) => (
          <span key={index} className={`${styles.star} ${isClicked ? styles.clicked : ''}`}>&#9733;</span>
        ))}
      </div>
    );
  };

  return (
    <div className={`${styles.card} ${isClicked ? styles.clicked : ''}`} onClick={handleCardClick}>
      <img
        src={hotel.image_urls[currentImageIndex]}
        alt={hotel.name}
        className={styles.cardImage}
      />
      <div className={styles.cardContent}>
        <h3>{hotel.name}</h3>
        <p>{hotel.address}</p>
        <div className={styles.starsContainer}>
          {renderStars(hotel.stars)}
          <p></p>
        </div>
        <p>Preț de persoană: {hotel.price_per_adult} lei</p>
        <Link to={`/hotel/${hotel.id}`} className={styles.detailsButton}>Vezi Detalii</Link>
      </div>
    </div>
  );
};

export default CardHotel;
