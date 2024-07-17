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
  const [numberOfPeople, setNumberOfPeople] = useState(1); // Default to 1 person

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
      alert('You need to be logged in to make a reservation.');
      return;
    }

    // Check if the user has already made a reservation for this hotel
    const { data: existingReservation, error: reservationError } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_email', userEmail)
      .eq('reservation_id', hotel.id)
      .eq('reservation_type', 'hotel')
      .single();

    if (reservationError && reservationError.code !== 'PGRST116') {
      // PGRST116 is the error code for no rows found
      console.error('Error checking existing reservation:', reservationError);
      alert('An error occurred. Please try again.');
      return;
    }

    if (existingReservation) {
      alert('You have already made a reservation for this hotel.');
      return;
    }

    // Prompt the user for the number of people
    const confirmedNumberOfPeople = prompt('Enter number of people for reservation:', numberOfPeople);

    if (confirmedNumberOfPeople === null || isNaN(confirmedNumberOfPeople) || confirmedNumberOfPeople <= 0) {
      alert('Please enter a valid number of people.');
      return;
    }

    const totalPrice = confirmedNumberOfPeople * hotel.price_per_adult;

    const reservationDetails = {
      hotel_name: hotel.name,
      hotel_address: hotel.address,
      stars: hotel.stars,
      valid_from: hotel.valid_from,
      valid_to: hotel.valid_to,
      price_per_adult: hotel.price_per_adult,
      description: hotel.description,
      photo_urls: hotel.image_urls,
      number_of_people: Number(confirmedNumberOfPeople),
      total_price: totalPrice.toFixed(2), // Ensure total price is formatted as a decimal
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

      alert('Reservation successful!');
    } catch (error) {
      console.error('Error making reservation:', error);
      alert('Failed to make reservation. Please try again.');
    }
  };

  if (!hotel) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Meniusus/>
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
            <strong>Address:</strong> {hotel.address}
          </p>
          <p className={styles.hotelDetailItem}>
            <strong>Stars:</strong> {hotel.stars}
          </p>
          <p className={styles.hotelDetailItem}>
            <strong>Valid from:</strong>{' '}
            {new Date(hotel.valid_from).toLocaleDateString()}
          </p>
          <p className={styles.hotelDetailItem}>
            <strong>Valid to:</strong>{' '}
            {new Date(hotel.valid_to).toLocaleDateString()}
          </p>
          <p className={styles.hotelDetailItem}>
            <strong>Price per adult:</strong> {hotel.price_per_adult}
          </p>
        </div>
        <p className={styles.hotelDescription}>{hotel.description}</p>
        <button onClick={handleReserve} className={styles.reserveButton}>
          Rezerva
        </button>
      </div>
    </div>
    <Meniujos/>
    </div>
  );
};

export default HotelDetails;
