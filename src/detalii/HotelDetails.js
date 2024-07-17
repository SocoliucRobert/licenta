import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';
import styles from './hotelDetails.module.css';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1); 
  const [checkInDate, setCheckInDate] = useState(''); 
  const [checkOutDate, setCheckOutDate] = useState(''); 

  useEffect(() => {
    const fetchHotel = async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching hotel:', error);
      } else {
        setHotel(data);
        setCheckInDate(data.valid_from); 
        setCheckOutDate(data.valid_to); 
      }
    };

    fetchHotel();
  }, [id]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [hotel]);

  useEffect(() => {
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        setUserEmail(parsedSession.user?.email || '');
      } catch (error) {
        console.error('Error parsing session JSON:', error);
      }
    }
  }, []);

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleReserve = async () => {
    if (!userEmail) {
      alert('Trebuie să fii conectat pentru a te putea rezerva un hotel !');
      return;
    }

    const { data: existingReservation, error: reservationError } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_email', userEmail)
      .eq('reservation_id', hotel.id)
      .eq('reservation_type', 'hotel')
      .single();

    if (reservationError && reservationError.code !== 'PGRST116') {
      
      console.error('Error checking existing reservation:', reservationError);
      alert('An error occurred. Please try again.');
      return;
    }

    if (existingReservation) {
      alert('Ai rezervat deja acest hotel !');
      return;
    }

    
    if (new Date(checkInDate) < new Date(hotel.valid_from) || new Date(checkOutDate) > new Date(hotel.valid_to) || new Date(checkInDate) >= new Date(checkOutDate)) {
      alert('Trebuie să selectezi o dată valabilă !');
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

    try {
      const { error } = await supabase.from('reservations').insert([
        {
          user_email: userEmail,
          reservation_type: 'hotel',
          reservation_id: hotel.id,
          reservation_details: reservationDetails,
        },
      ]);

      if (error) throw error;

      alert('Rezervarea s-a efectuat cu succes!');
    } catch (error) {
      console.error('Error making reservation:', error);
      alert('Eroare la rezervarea hotelului');
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
        </div>
      </div>
      <Meniujos />
    </div>
  );
};

export default HotelDetails;
