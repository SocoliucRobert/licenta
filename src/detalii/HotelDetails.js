import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';
import styles from './hotelDetails.module.css';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import ReviewCard from '../carduri/ReviewCard';

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(1);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setHotel(data);
        setCheckInDate(data.valid_from);
        setCheckOutDate(data.valid_to);
      } catch (error) {
        console.error('Error fetching hotel:', error.message);
      }
    };

    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('hotel_id', id);

        if (error) {
          throw error;
        }

        setReviews(data || []);
      } catch (error) {
        console.error('Error fetching reviews:', error.message);
      }
    };

    fetchHotel();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error fetching session:', error.message);
          return;
        }

        if (session) {
          setUserEmail(session.user?.email || '');
        } else {
          setUserEmail('');
        }
      } catch (error) {
        console.error('Error checking authentication:', error.message);
      }
    };

    checkAuthentication();
  }, []);

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleReserve = async () => {
    if (!userEmail) {
      alert('Trebuie să fii conectat pentru a lăsa o recenzie !');
      return;
    }

    try {
      const { data: existingReservation, error: reservationError } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_email', userEmail)
        .eq('reservation_id', hotel.id)
        .eq('reservation_type', 'hotel')
        .single();

      if (reservationError && reservationError.code !== 'PGRST116') {
        throw reservationError;
      }

      if (existingReservation) {
        alert('Ai rezervat deja acest hotel !');
        return;
      }

      if (new Date(checkInDate) < new Date(hotel.valid_from) || new Date(checkOutDate) > new Date(hotel.valid_to) || new Date(checkInDate) >= new Date(checkOutDate)) {
        alert('Seleteaza o dată validă ! ');
        return;
      }

      const daysDifference = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
      const totalPrice = daysDifference * numberOfPeople * hotel.price_per_adult;

      const reservationDetails = {
        hotel_name: hotel.name,
        hotel_address: hotel.address,
        stars: hotel.stars,
        valid_from: hotel.valid_from,
        valid_to: hotel.valid_to,
        price_per_adult: hotel.price_per_adult,
        description: hotel.description,
        photo_urls: hotel.image_urls,
        number_of_people: Number(numberOfPeople),
        total_price: totalPrice.toFixed(2),
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
      };

      const { error } = await supabase.from('reservations').insert([
        {
          user_email: userEmail,
          reservation_type: 'hotel',
          reservation_id: hotel.id,
          reservation_details: reservationDetails,
        },
      ]);

      if (error) {
        throw error;
      }

      alert('Rezervarea a fost făcută cu succes!');
    } catch (error) {
      console.error('Error making reservation:', error.message);
      alert('Error making hotel reservation');
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    if (!userEmail) {
      alert('Trebuie să fii conectat pentru a lăsa o recenzie !');
      return;
    }

 
    const userReview = reviews.find(review => review.user_name === userEmail.split('@')[0]);
    if (userReview) {
      alert('Ai lăsat deja o recenzie la acest hotel !');
      return;
    }

    const newReview = {
      hotel_id: hotel.id,
      user_name: userEmail.split('@')[0],
      rating,
      review_text: reviewText,
    };

    try {
      const { error } = await supabase.from('reviews').insert([newReview]);

      if (error) {
        throw error;
      }

      setReviews((prevReviews) => [...prevReviews, newReview]);
      setReviewText('');
      setRating(1);
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error.message);
      alert('Eroare la lăsarea unei recenzii !');
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId);

      if (error) {
        throw error;
      }

      setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
      alert('Recenzie ștearsa cu succes !');
    } catch (error) {
      console.error('Error deleting review:', error.message);
      alert('Eroare la ștergerea unei recenzii !');
    }
  };

  if (!hotel) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Meniusus />
      <div className={styles.hotelDetailsContainer}>
        <div className={styles.hotelImageContainer}>
          <img
            src={hotel.image_urls[currentImageIndex]}
            alt={`Hotel view ${currentImageIndex + 1}`}
            className={styles.hotelImage}
          />
          <div className={styles.imageGallery}>
            {hotel.image_urls.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Hotel view ${index + 1}`}
                className={styles.galleryImage}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        </div>
        <div className={styles.hotelContent}>
          <h1 className={styles.hotelName}>{hotel.name}</h1>
          <div className={styles.hotelDetails}>
            <p className={styles.hotelDetailItem}>
              <strong>Adresă:</strong> {hotel.address}
            </p>
            <p className={styles.hotelDetailItem}>
              <strong>Număr de stele:</strong> {hotel.stars}
            </p>
            <p className={styles.hotelDetailItem}>
              <strong>Valabil de la data:</strong>{' '}
              {new Date(hotel.valid_from).toLocaleDateString()}
            </p>
            <p className={styles.hotelDetailItem}>
              <strong>Până la data:</strong>{' '}
              {new Date(hotel.valid_to).toLocaleDateString()}
            </p>
            <p className={styles.hotelDetailItem}>
              <strong>Preț pe persoană:</strong> {hotel.price_per_adult + ' lei'}
            </p>
          </div>
          <p className={styles.hotelDescription}>{hotel.description}</p>
          <div className={styles.reservationControls}>
            <label>
              Data check-in:
              <input
                type="date"
                value={checkInDate}
                min={hotel.valid_from}
                max={hotel.valid_to}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
              />
            </label>
            <label>
              Data check-out:
              <input
                type="date"
                value={checkOutDate}
                min={hotel.valid_from}
                max={hotel.valid_to}
                onChange={(e) => setCheckOutDate(e.target.value)}
                required
              />
            </label>
            <label>
              Număr de persoane:
              <input
                type="number"
                value={numberOfPeople}
                min="1"
                onChange={(e) => setNumberOfPeople(e.target.value)}
                required
              />
            </label>
            <button onClick={handleReserve} className={styles.reserveButton}>
              Rezervă
            </button>
          </div>
          <button onClick={() => setShowReviewForm(!showReviewForm)} className={styles.reserveButton}>
            {showReviewForm ? 'Anulează recenzia' : 'Adaugă o recenzie'}
          </button>
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
              <label>
                Notă:
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </label>
              <label>
                Recenzie:
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className={styles.reserveButton}>
                Trimite recenzia
              </button>
            </form>
          )}
          {reviews.length > 0 && (
            <div className={styles.reviewsContainer}>
              <h2>Recenzii:</h2>
              {reviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <ReviewCard
                    userName={review.user_name}
                    rating={review.rating}
                    reviewText={review.review_text}
                  />
                  {review.user_name === userEmail.split('@')[0] && (
                    <button type='submit' onClick={() => handleReviewDelete(review.id)} className={styles.reserveButton}>
                      Șterge recenzia
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Meniujos />
    </div>
  );
};

export default HotelDetails;
