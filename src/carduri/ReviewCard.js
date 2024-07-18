import React from 'react';
import PropTypes from 'prop-types';
import styles from './reviewcard.module.css';

const ReviewCard = ({ userName, rating, reviewText }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className={styles.starFilled}>&#9733;</span>);
      } else {
        stars.push(<span key={i} className={styles.starEmpty}>&#9733;</span>);
      }
    }
    return stars;
  };

  return (
    <div className={styles.reviewCard}>
      <div className={styles.ratingStars}>{renderStars()}</div>
      <div className={styles.userName}>{userName}</div>
      <div className={styles.reviewText}>{reviewText}</div>
    </div>
  );
};

ReviewCard.propTypes = {
  userName: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  reviewText: PropTypes.string.isRequired,
};

export default ReviewCard;
